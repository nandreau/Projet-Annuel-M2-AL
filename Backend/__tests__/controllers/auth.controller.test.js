jest.mock('../../app/models', () => {
  const createModelMock = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  });
  return {
    User: createModelMock(),
    Role: createModelMock(),
    RefreshToken: createModelMock()
  };
});
jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

const authController = require('../../app/controllers/auth.controller');

let req, res;
beforeEach(() => {
  jest.clearAllMocks();
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
});

describe('Auth Controller', () => {

  describe('signup', () => {
    it('should hash password, create user, assign default role, and respond with success message', async () => {
      req.body = {
        firstname: 'John',
        name: 'Doe',
        email: 'john@example.com',
        date: '2025-01-01',
        avatar: '',
        password: 'pass123',
        job: 'Engineer'
      };
      const { User, Role } = require('../../app/models');
      const bcrypt = require('bcryptjs');
      bcrypt.hashSync.mockReturnValue('hashedPass');
      const newUser = { id: 1, setRoles: jest.fn().mockResolvedValue(undefined) };
      User.create.mockResolvedValue(newUser);
      const defaultRole = { id: 2, name: 'user' };
      Role.findOne.mockResolvedValue(defaultRole);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ message: 'Utilisateur enregistré avec succès avec le rôle USER !' });
    });

    it('should handle errors during signup and respond with 400', async () => {
      req.body = {};
      const { User } = require('../../app/models');
      const err = new Error('Signup error');
      User.create.mockRejectedValue(err);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Erreur lors de l'enregistrement : Signup error" });
    });
  });

  describe('signin', () => {
    it('should return 404 if user is not found', async () => {
      req.body = { email: 'x@example.com', password: 'pass' };
      const { User } = require('../../app/models');
      User.findOne.mockResolvedValue(null);

      await authController.signin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé.' });
    });

    it('should return 401 if password is invalid', async () => {
      req.body = { email: 'x@example.com', password: 'wrong' };
      const user = { id: 10, password: 'hashed', getRoles: jest.fn() };
      const { User } = require('../../app/models');
      User.findOne.mockResolvedValue(user);
      const bcrypt = require('bcryptjs');
      bcrypt.compareSync.mockReturnValue(false);

      await authController.signin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: 'Mot de passe invalide !' });
    });

    it('should login successfully and return user data with tokens', async () => {
      req.body = { email: 'john@example.com', password: '123456' };
      const userRoles = [{ name: 'user' }];
      const user = {
        id: 42,
        firstname: 'John',
        name: 'Doe',
        email: 'john@example.com',
        password: 'hashedPass',
        avatar: 'avatar.png',
        getRoles: jest.fn().mockResolvedValue(userRoles)
      };
      const { User, RefreshToken } = require('../../app/models');
      User.findOne.mockResolvedValue(user);
      const bcrypt = require('bcryptjs');
      bcrypt.compareSync.mockReturnValue(true);
      const jwt = require('jsonwebtoken');
      jwt.sign.mockReturnValueOnce('ACCESS_TOKEN').mockReturnValueOnce('REFRESH_TOKEN');
      RefreshToken.create.mockResolvedValue({ id: 1 });

      await authController.signin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        id: 42,
        firstname: 'John',
        name: 'Doe',
        email: 'john@example.com',
        roles: ['ROLE_USER'],
        avatar: 'avatar.png',
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN'
      }));
    });

    it('should handle errors during signin and respond with 500', async () => {
      req.body = { email: 'fail@example.com', password: 'fail' };
      const { User } = require('../../app/models');
      const err = new Error('DB fail');
      User.findOne.mockRejectedValue(err);

      await authController.signin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Erreur lors de la connexion : DB fail" });
    });
  });

  describe('verify', () => {
    it('should respond with user id and valid token message if token is verified', () => {
      req.userId = 100;

      authController.verify(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ id: 100, message: 'Jeton valide' });
    });
  });

  describe('refreshToken', () => {
    it('should return 400 if no refresh token provided', async () => {
      req.body = {};

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Le jeton d'actualisation est requis." });
    });

    it('should return 403 if refresh token is not found', async () => {
      req.body = { refreshToken: 'abc' };
      const { RefreshToken } = require('../../app/models');
      RefreshToken.findOne.mockResolvedValue(null);

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ message: "Jeton d'actualisation invalide ou expiré." });
    });

    it('should return 403 if refresh token is expired', async () => {
      req.body = { refreshToken: 'expiredToken' };
      const pastDate = new Date(Date.now() - 1000);
      const stored = { token: 'expiredToken', userId: 7, expiryDate: pastDate, revokedAt: null, update: jest.fn() };
      const { RefreshToken } = require('../../app/models');
      RefreshToken.findOne.mockResolvedValue(stored);

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ message: "Jeton d'actualisation invalide ou expiré." });
    });

    it('should return 403 if refresh token was revoked', async () => {
      req.body = { refreshToken: 'revokedToken' };
      const futureDate = new Date(Date.now() + 10000);
      const stored = { token: 'revokedToken', userId: 8, expiryDate: futureDate, revokedAt: new Date(), update: jest.fn() };
      const { RefreshToken } = require('../../app/models');
      RefreshToken.findOne.mockResolvedValue(stored);

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ message: "Jeton d'actualisation invalide ou expiré." });
    });

    it('should generate new tokens and return them if refresh token is valid', async () => {
      req.body = { refreshToken: 'validToken' };
      const futureDate = new Date(Date.now() + 60 * 1000);
      const stored = { token: 'validToken', userId: 5, expiryDate: futureDate, revokedAt: null, update: jest.fn().mockResolvedValue([1]) };
      const { RefreshToken, User } = require('../../app/models');
      RefreshToken.findOne.mockResolvedValue(stored);
      User.findByPk.mockResolvedValue({ id: 5 });
      const jwt = require('jsonwebtoken');
      jwt.verify.mockReturnValue({ id: 5 });
      jwt.sign.mockReturnValueOnce('NEW_REFRESH_TOKEN').mockReturnValueOnce('NEW_ACCESS_TOKEN');
      RefreshToken.create.mockResolvedValue({ id: 2 });

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        accessToken: 'NEW_ACCESS_TOKEN',
        refreshToken: 'NEW_REFRESH_TOKEN'
      });
    });

    it('should return 403 if token verification fails', async () => {
      req.body = { refreshToken: 'badToken' };
      const stored = {
        token: 'badToken',
        userId: 10,
        expiryDate: new Date(Date.now() + 60000),
        revokedAt: null,
        update: jest.fn()
      };
      const { RefreshToken } = require('../../app/models');
      RefreshToken.findOne.mockResolvedValue(stored);
      const jwt = require('jsonwebtoken');
      const err = new Error('Invalid signature');
      err.name = 'JsonWebTokenError';
      jwt.verify.mockImplementation(() => { throw err; });

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ message: "Jeton d'actualisation invalide !" });
    });

    it('should return 403 if token is expired (TokenExpiredError)', async () => {
      req.body = { refreshToken: 'expiredJwtToken' };
      const stored = {
        token: 'expiredJwtToken',
        userId: 11,
        expiryDate: new Date(Date.now() + 60000),
        revokedAt: null,
        update: jest.fn()
      };
      const { RefreshToken } = require('../../app/models');
      RefreshToken.findOne.mockResolvedValue(stored);
      const jwt = require('jsonwebtoken');
      const err = new Error('JWT expired');
      err.name = 'TokenExpiredError';
      jwt.verify.mockImplementation(() => { throw err; });

      await authController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ message: "Le jeton d'actualisation a expiré. Veuillez vous reconnecter." });
    });
  });

  describe('signout', () => {
    it('should revoke refresh token if provided and respond with signout message', async () => {
      req.body = { refreshToken: 'someToken' };
      const { RefreshToken } = require('../../app/models');
      RefreshToken.update.mockResolvedValue([1]);

      await authController.signout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: "Déconnexion réussie !" });
    });

    it('should handle signout even if no refresh token is provided', async () => {
      req.body = {};

      await authController.signout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: "Déconnexion réussie !" });
    });
  });
});
