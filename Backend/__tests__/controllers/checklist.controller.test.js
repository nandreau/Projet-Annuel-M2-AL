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
    Checklist: createModelMock()
  };
});

const checklistController = require('../../app/controllers/checklist.controller');

let req, res;
beforeEach(() => {
  jest.clearAllMocks();
  req = { query: {}, params: {}, body: {} };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
});

describe('Checklist Controller', () => {
  describe('findAll', () => {
    it('should return all checklist items', async () => {
      const items = [{ id: 1 }, { id: 2 }];
      const { Checklist } = require('../../app/models');
      Checklist.findAll.mockResolvedValue(items);
      await checklistController.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(items);
    });

    it('should handle error and respond 500', async () => {
      const { Checklist } = require('../../app/models');
      Checklist.findAll.mockRejectedValue(new Error('Erreur'));
      await checklistController.findAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la récupération : Erreur' });
    });
  });

  describe('findOne', () => {
    it('should return checklist item if found', async () => {
      req.params.id = 1;
      const item = { id: 1 };
      const { Checklist } = require('../../app/models');
      Checklist.findByPk.mockResolvedValue(item);
      await checklistController.findOne(req, res);
      expect(res.json).toHaveBeenCalledWith(item);
    });

    it('should return 404 if checklist item not found', async () => {
      req.params.id = 1;
      const { Checklist } = require('../../app/models');
      Checklist.findByPk.mockResolvedValue(null);
      await checklistController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Élément non trouvé' });
    });

    it('should handle error and respond 500', async () => {
      req.params.id = 1;
      const { Checklist } = require('../../app/models');
      Checklist.findByPk.mockRejectedValue(new Error('Error'));
      await checklistController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la récupération : Error' });
    });
  });

  describe('create', () => {
    it('should create new checklist item and return it', async () => {
      req.body = { title: 'Task Item' };
      const newItem = { id: 5, title: 'Task Item' };
      const { Checklist } = require('../../app/models');
      Checklist.create.mockResolvedValue(newItem);
      await checklistController.create(req, res);
      expect(Checklist.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Élément créé avec succès', data: newItem });
    });

    it('should handle error on create and respond 400', async () => {
      const { Checklist } = require('../../app/models');
      Checklist.create.mockRejectedValue(new Error('Create fail'));
      await checklistController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la création : Create fail' });
    });
  });

  describe('update', () => {
    it('should update checklist item and return updated item', async () => {
      req.params.id = 3;
      req.body = { done: true };
      const { Checklist } = require('../../app/models');
      const updatedItem = { id: 3, done: true };
      Checklist.update.mockResolvedValue([1]);
      Checklist.findByPk.mockResolvedValue(updatedItem);
      await checklistController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mise à jour réussie', data: updatedItem });
    });

    it('should return 404 if checklist item not found for update', async () => {
      req.params.id = 4;
      const { Checklist } = require('../../app/models');
      Checklist.update.mockResolvedValue([0]);
      await checklistController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Élément non trouvé' });
    });

    it('should handle error on update and respond 400', async () => {
      req.params.id = 5;
      const { Checklist } = require('../../app/models');
      Checklist.update.mockRejectedValue(new Error('Update fail'));
      await checklistController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la mise à jour : Update fail' });
    });
  });

  describe('delete', () => {
    it('should delete checklist item and return success message', async () => {
      req.params.id = 2;
      const { Checklist } = require('../../app/models');
      Checklist.destroy.mockResolvedValue(1);
      await checklistController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Suppression réussie' });
    });

    it('should return 404 if checklist item not found', async () => {
      req.params.id = 9;
      const { Checklist } = require('../../app/models');
      Checklist.destroy.mockResolvedValue(0);
      await checklistController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Élément non trouvé' });
    });

    it('should handle error on delete and respond 500', async () => {
      req.params.id = 10;
      const { Checklist } = require('../../app/models');
      Checklist.destroy.mockRejectedValue(new Error('Delete error'));
      await checklistController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la suppression : Delete error' });
    });
  });
});
