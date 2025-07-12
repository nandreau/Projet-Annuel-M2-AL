const assignmentController = require('../../app/controllers/assignment.controller');
const { Assignment, User } = require('../../app/models');

jest.mock('../../app/models', () => {
  const SequelizeMock = {
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };
  return {
    Assignment: { ...SequelizeMock },
    User: { ...SequelizeMock },
  };
});

describe('Assignment Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new assignment and link users, then respond with success message', async () => {
      const assignmentInstance = {
        id: 1,
        setUsers: jest.fn(),
      };
      Assignment.create.mockResolvedValue(assignmentInstance);
      req.body = { title: 'A', assignment_users: [1, 2] };
      Assignment.findByPk.mockResolvedValue({});

      await assignmentController.create(req, res);

      expect(Assignment.create).toHaveBeenCalledWith({ title: 'A' });
      expect(assignmentInstance.setUsers).toHaveBeenCalledWith([1, 2]);
      expect(Assignment.findByPk).toHaveBeenCalledWith(assignmentInstance.id, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Assignement créé avec succès !',
        data: expect.any(Object),
      });
    });

    it('should create assignment with no users and respond with success, without calling setUsers', async () => {
      const assignmentInstance = {
        id: 2,
        setUsers: jest.fn(),
      };
      Assignment.create.mockResolvedValue(assignmentInstance);
      req.body = { title: 'B' };
      Assignment.findByPk.mockResolvedValue({});

      await assignmentController.create(req, res);

      expect(assignmentInstance.setUsers).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Assignement créé avec succès !',
        data: expect.any(Object),
      });
    });

    it('should handle error during creation and respond with status 400 and error message', async () => {
      Assignment.create.mockImplementation(() => {
        throw new Error('Create failed');
      });

      await assignmentController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
      }));
    });
  });

  describe('findAll', () => {
    it('should return all assignments with associated users', async () => {
      const assignments = [{ id: 1 }, { id: 2 }];
      Assignment.findAll.mockResolvedValue(assignments);

      await assignmentController.findAll(req, res);

      expect(res.json).toHaveBeenCalledWith(assignments);
    });
  });

  describe('findOne', () => {
    it('should return assignment if found', async () => {
      const assignment = { id: 5 };
      req.params.id = 5;
      Assignment.findByPk.mockResolvedValue(assignment);

      await assignmentController.findOne(req, res);

      expect(res.json).toHaveBeenCalledWith(assignment);
    });

    it('should return 404 if assignment not found', async () => {
      req.params.id = 100;
      Assignment.findByPk.mockResolvedValue(null);

      await assignmentController.findOne(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Aucun assignement trouvé avec cet identifiant.' });
    });
  });

  describe('update', () => {
    it('should update assignment data and user links, then return updated assignment', async () => {
      const assignment = {
        id: 5,
        name: 'New Name',
        setUsers: jest.fn(),
        users: [],
      };
      Assignment.update.mockResolvedValue([1]);
      Assignment.findByPk
        .mockResolvedValueOnce({ setUsers: jest.fn() })
        .mockResolvedValueOnce(assignment);
      req.params.id = 5;
      req.body = { name: 'New Name', assignment_users: [1, 2] };

      await assignmentController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Assignement mis à jour avec succès !',
        data: assignment,
      });
    });

    it('should update assignment without user list and return updated assignment', async () => {
      const updatedAssignment = { id: 6, title: 'Updated Title' };
      Assignment.update.mockResolvedValue([1]);
      Assignment.findByPk.mockResolvedValue(updatedAssignment);
      req.params.id = 6;
      req.body = { title: 'Updated Title' };

      await assignmentController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Assignement mis à jour avec succès !',
        data: updatedAssignment,
      });
    });

    it('should return 404 if assignment to update is not found', async () => {
      Assignment.update.mockResolvedValue([0]);
      req.params.id = 7;

      await assignmentController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Aucun assignement trouvé à mettre à jour.' });
    });

    it('should handle errors during update and return 400', async () => {
      Assignment.update.mockRejectedValue(new Error('Update fail'));

      await assignmentController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur lors de la mise à jour : Update fail',
      });
    });
  });

  describe('delete', () => {
    it('should delete assignment and return success message', async () => {
      req.params.id = 15;
      Assignment.destroy.mockResolvedValue(1);

      await assignmentController.delete(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Assignement supprimé avec succès !' });
    });

    it('should return 404 if assignment not found', async () => {
      req.params.id = 404;
      Assignment.destroy.mockResolvedValue(0);

      await assignmentController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Aucun assignement trouvé à supprimer.' });
    });
  });
});
