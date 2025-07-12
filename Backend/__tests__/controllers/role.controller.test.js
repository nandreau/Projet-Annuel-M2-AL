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
    Role: createModelMock()
  };
});

const roleController = require('../../app/controllers/role.controller');

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

describe('Role Controller', () => {

  describe('findAll', () => {
    it('should return all roles', async () => {
      const roles = [{ id: 1, name: 'user' }, { id: 2, name: 'admin' }];
      const { Role } = require('../../app/models');
      Role.findAll.mockResolvedValue(roles);
      await roleController.findAll(req, res);
      expect(Role.findAll).toHaveBeenCalledWith({ order: [['id', 'ASC']] });
      expect(res.json).toHaveBeenCalledWith(roles);
    });

    it('should handle error and respond 500', async () => {
      const err = new Error('DB error');
      const { Role } = require('../../app/models');
      Role.findAll.mockRejectedValue(err);
      await roleController.findAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: `Erreur lors de la récupération : ${err.message}`
      });
    });
  });

  describe('findOne', () => {
    it('should return role if found', async () => {
      req.params = { id: 2 };
      const role = { id: 2, name: 'user' };
      const { Role } = require('../../app/models');
      Role.findByPk.mockResolvedValue(role);
      await roleController.findOne(req, res);
      expect(Role.findByPk).toHaveBeenCalledWith(2);
      expect(res.json).toHaveBeenCalledWith(role);
    });

    it('should return 404 if role not found', async () => {
      req.params = { id: 99 };
      const { Role } = require('../../app/models');
      Role.findByPk.mockResolvedValue(null);
      await roleController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rôle non trouvé' });
    });

    it('should handle error and respond 500', async () => {
      req.params = { id: 3 };
      const err = new Error('Error');
      const { Role } = require('../../app/models');
      Role.findByPk.mockRejectedValue(err);
      await roleController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: `Erreur lors de la récupération : ${err.message}`
      });
    });
  });

  describe('create', () => {
    it('should create a role if id not exists', async () => {
      req.body = { id: 5, name: 'Tester' };
      const { Role } = require('../../app/models');
      Role.findByPk.mockResolvedValue(null);
      const newRole = { id: 5, name: 'Tester' };
      Role.create.mockResolvedValue(newRole);
      await roleController.create(req, res);
      expect(Role.findByPk).toHaveBeenCalledWith(5);
      expect(Role.create).toHaveBeenCalledWith({ id: 5, name: 'Tester' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Rôle créé avec succès',
        data: newRole
      });
    });

    it('should return 400 if role ID already exists', async () => {
      req.body = { id: 1, name: 'Existing' };
      const existingRole = { id: 1, name: 'Existing' };
      const { Role } = require('../../app/models');
      Role.findByPk.mockResolvedValue(existingRole);
      await roleController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'ID déjà utilisé' });
    });

    it('should handle error and respond 400', async () => {
      req.body = { id: 6, name: 'NewRole' };
      const { Role } = require('../../app/models');
      Role.findByPk.mockResolvedValue(null);
      const err = new Error('Create fail');
      Role.create.mockRejectedValue(err);
      await roleController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: `Erreur lors de la création : ${err.message}`
      });
    });
  });

  describe('update', () => {
    it('should update existing role name', async () => {
      req.params = { id: 2 };
      req.body = { name: 'NewName' };
      const { Role } = require('../../app/models');
      Role.update.mockResolvedValue([1]);
      const updatedRole = { id: 2, name: 'NewName' };
      Role.findByPk.mockResolvedValue(updatedRole);
      await roleController.update(req, res);
      expect(Role.update).toHaveBeenCalledWith({ name: 'NewName' }, { where: { id: 2 } });
      expect(Role.findByPk).toHaveBeenCalledWith(2);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Rôle mis à jour avec succès',
        data: updatedRole
      });
    });

    it('should return 404 if role to update not found', async () => {
      req.params = { id: 10 };
      req.body = { name: 'Name' };
      const { Role } = require('../../app/models');
      Role.update.mockResolvedValue([0]);
      await roleController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rôle non trouvé' });
    });

    it('should handle error and respond 400', async () => {
      req.params = { id: 3 };
      req.body = { name: 'Name' };
      const err = new Error('Update err');
      const { Role } = require('../../app/models');
      Role.update.mockRejectedValue(err);
      await roleController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: `Erreur lors de la mise à jour : ${err.message}`
      });
    });
  });

  describe('delete', () => {
    it('should delete role and return success message', async () => {
      req.params = { id: 1 };
      const { Role } = require('../../app/models');
      Role.destroy.mockResolvedValue(1);
      await roleController.delete(req, res);
      expect(Role.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: 'Rôle supprimé avec succès' });
    });

    it('should return 404 if role not found to delete', async () => {
      req.params = { id: 5 };
      const { Role } = require('../../app/models');
      Role.destroy.mockResolvedValue(0);
      await roleController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rôle non trouvé' });
    });

    it('should handle error and respond 500', async () => {
      req.params = { id: 2 };
      const err = new Error('Delete error');
      const { Role } = require('../../app/models');
      Role.destroy.mockRejectedValue(err);
      await roleController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: `Erreur lors de la suppression : ${err.message}`
      });
    });
  });

});
