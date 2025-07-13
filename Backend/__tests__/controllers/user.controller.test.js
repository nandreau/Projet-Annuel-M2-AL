jest.mock("../../app/models", () => {
  const createModelMock = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    setRoles: jest.fn(),
  });

  return {
    User: createModelMock(),
    Role: {
      findOne: jest.fn(),
      findAll: jest.fn(),
    },
  };
});

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn(),
}));

const userController = require("../../app/controllers/user.controller");
const bcrypt = require("bcryptjs");
const { User, Role } = require("../../app/models");

let req, res;
beforeEach(() => {
  jest.clearAllMocks();
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
});

describe("User Controller", () => {
  describe("findAll", () => {
    it("should return all users (excluding passwords)", async () => {
      const users = [{ id: 1 }, { id: 2 }];
      User.findAll.mockResolvedValue(users);

      await userController.findAll(req, res);

      expect(User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.any(Object),
          include: expect.any(Array),
          order: expect.any(Array),
        }),
      );
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("should handle error and respond 500", async () => {
      const error = new Error("DB error");
      User.findAll.mockRejectedValue(error);

      await userController.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération : DB error",
      });
    });
  });

  describe("findOne", () => {
    it("should return user if found", async () => {
      req.params = { id: 1 };
      const user = { id: 1 };
      User.findByPk.mockResolvedValue(user);

      await userController.findOne(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: 2 };
      User.findByPk.mockResolvedValue(null);

      await userController.findOne(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé",
      });
    });

    it("should handle error and respond 500", async () => {
      req.params = { id: 3 };
      const error = new Error("Error");
      User.findByPk.mockRejectedValue(error);

      await userController.findOne(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération : Error",
      });
    });
  });

  describe("create", () => {
    it("should create a new user with default role when roles not specified", async () => {
      req.body = {
        firstname: "John",
        name: "Doe",
        email: "john@example.com",
        password: "pass",
      };
      const hashed = "hashedPass";
      bcrypt.hashSync.mockReturnValue(hashed);

      const createdUser = { id: 1, setRoles: jest.fn() };
      User.create.mockResolvedValue(createdUser);
      User.findByPk.mockResolvedValue(createdUser);

      const defaultRole = { id: 1, name: "user" };
      Role.findOne.mockResolvedValue(defaultRole);

      await userController.create(req, res);

      expect(bcrypt.hashSync).toHaveBeenCalledWith("pass", 8);
      expect(User.create).toHaveBeenCalled();
      expect(Role.findOne).toHaveBeenCalledWith({ where: { name: "user" } });
      expect(createdUser.setRoles).toHaveBeenCalledWith([defaultRole]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur créé avec succès",
        data: createdUser,
      });
    });

    it("should create a user with specified roles", async () => {
      req.body = {
        firstname: "Alice",
        name: "Smith",
        email: "alice@example.com",
        password: "secret",
        roles: ["admin"],
      };
      const hashed = "hashedSecret";
      bcrypt.hashSync.mockReturnValue(hashed);

      const createdUser = { id: 2, setRoles: jest.fn() };
      User.create.mockResolvedValue(createdUser);
      User.findByPk.mockResolvedValue(createdUser);

      const roleRecords = [{ id: 2, name: "admin" }];
      Role.findAll.mockResolvedValue(roleRecords);

      await userController.create(req, res);

      expect(bcrypt.hashSync).toHaveBeenCalledWith("secret", 8);
      expect(Role.findAll).toHaveBeenCalledWith({ where: { name: ["admin"] } });
      expect(createdUser.setRoles).toHaveBeenCalledWith(roleRecords);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur créé avec succès",
        data: createdUser,
      });
    });

    it("should handle creation error", async () => {
      req.body = { email: "fail@example.com", password: "pass" };
      const error = new Error("Create fail");
      bcrypt.hashSync.mockReturnValue("hash");
      User.create.mockRejectedValue(error);

      await userController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la création : Create fail",
      });
    });
  });

  describe("update", () => {
    it("should update user (excluding password and roles)", async () => {
      req.params = { id: 1 };
      req.body = { name: "New Name" };

      User.update.mockResolvedValue([1]);
      const updatedUser = { id: 1, name: "New Name" };
      User.findByPk.mockResolvedValue(updatedUser);

      await userController.update(req, res);

      expect(User.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur mis à jour avec succès",
        data: updatedUser,
      });
    });

    it("should update password and roles when provided", async () => {
      req.params = { id: 2 };
      req.body = { password: "newpass", roles: ["admin"] };

      const hashed = "hashedNew";
      bcrypt.hashSync.mockReturnValue(hashed);

      User.update.mockResolvedValue([1]);
      const user = { id: 2, setRoles: jest.fn() };
      User.findByPk.mockResolvedValue(user);
      const roleRecords = [{ id: 3, name: "admin" }];
      Role.findAll.mockResolvedValue(roleRecords);

      await userController.update(req, res);

      expect(bcrypt.hashSync).toHaveBeenCalledWith("newpass", 8);
      expect(Role.findAll).toHaveBeenCalledWith({ where: { name: ["admin"] } });
      expect(user.setRoles).toHaveBeenCalledWith(roleRecords);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur mis à jour avec succès",
        data: user,
      });
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: 3 };
      req.body = { name: "Nothing" };
      User.update.mockResolvedValue([0]);

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé",
      });
    });

    it("should handle update error", async () => {
      req.params = { id: 4 };
      req.body = { name: "Error" };
      const error = new Error("Update error");
      User.update.mockRejectedValue(error);

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour : Update error",
      });
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      req.params = { id: 1 };
      User.destroy.mockResolvedValue(1);

      await userController.delete(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur supprimé avec succès",
      });
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: 2 };
      User.destroy.mockResolvedValue(0);

      await userController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé",
      });
    });

    it("should handle delete error", async () => {
      req.params = { id: 3 };
      const error = new Error("Delete error");
      User.destroy.mockRejectedValue(error);

      await userController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression : Delete error",
      });
    });
  });
});
