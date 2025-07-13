const taskController = require("../../app/controllers/task.controller");
const { Task, User } = require("../../app/models");

jest.mock("../../app/models", () => {
  const SequelizeMock = {
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };
  return {
    Task: { ...SequelizeMock },
    User: { ...SequelizeMock },
    Assignment: { ...SequelizeMock },
    Checklist: { ...SequelizeMock },
    Phase: { ...SequelizeMock },
    Chantier: { ...SequelizeMock },
  };
});

describe("Task Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { userId: 1, body: {}, params: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all tasks for admin", async () => {
      User.findByPk.mockResolvedValue({
        roles: [{ name: "admin" }],
      });
      const tasks = [{ id: 1 }, { id: 2 }];
      Task.findAll.mockResolvedValue(tasks);

      await taskController.findAll(req, res);

      expect(Task.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.any(Array),
          order: expect.any(Array),
        }),
      );
      expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it("should handle error and respond 500", async () => {
      User.findByPk.mockResolvedValue(null);

      await taskController.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Utilisateur ou rôles introuvables"),
        }),
      );
    });
  });

  describe("findOne", () => {
    it("should return task if found", async () => {
      const task = { id: 5 };
      req.params.id = 5;
      Task.findByPk.mockResolvedValue(task);

      await taskController.findOne(req, res);

      expect(Task.findByPk).toHaveBeenCalledWith(5, expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it("should handle not found", async () => {
      req.params.id = 99;
      Task.findByPk.mockResolvedValue(null);

      await taskController.findOne(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Tâche non trouvée" });
    });

    it("should handle error", async () => {
      req.params.id = 7;
      Task.findByPk.mockRejectedValue(new Error("Error"));

      await taskController.findOne(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur : Error" });
    });
  });

  describe("update", () => {
    it("should update task and return updated task", async () => {
      req.params.id = 3;
      req.body = { title: "NewTitle" };
      Task.update.mockResolvedValue([1]);
      Task.findByPk.mockResolvedValue({ id: 3, title: "NewTitle" });

      await taskController.update(req, res);

      expect(Task.update).toHaveBeenCalledWith(req.body, { where: { id: 3 } });
      expect(res.json).toHaveBeenCalledWith({
        message: "Tâche mise à jour avec succès",
        data: { id: 3, title: "NewTitle" },
      });
    });

    it("should handle update error", async () => {
      req.params.id = 5;
      req.body = { title: "Title" };
      Task.update.mockRejectedValue(new Error("Update error"));

      await taskController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur : Update error",
      });
    });
  });

  describe("updateMeta", () => {
    it("should update task meta and return task", async () => {
      req.params.id = 10;
      req.body = { status: "done" };
      Task.findByPk
        .mockResolvedValueOnce({ done: false })
        .mockResolvedValueOnce({ id: 10 });

      Task.update.mockResolvedValue([1]);

      await taskController.updateMeta(req, res);

      expect(Task.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Tâche mise à jour avec succès",
        data: { id: 10 },
      });
    });

    it("should return 400 if already done", async () => {
      Task.findByPk.mockResolvedValue({ done: true });
      req.params.id = 10;

      await taskController.updateMeta(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Tâche déjà validée, modification interdite",
      });
    });

    it("should handle error", async () => {
      Task.findByPk.mockRejectedValue(new Error("Update fail"));
      req.params.id = 10;

      await taskController.updateMeta(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur : Update fail",
      });
    });
  });

  describe("validate", () => {
    it("should mark task as validated and return updated task", async () => {
      const task = {
        done: false,
        images: ["img1.png"],
        save: jest.fn(),
      };
      req.params.id = 12;
      Task.findByPk
        .mockResolvedValueOnce(task)
        .mockResolvedValueOnce({ id: 12 });

      await taskController.validate(req, res);

      expect(task.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Tâche validée avec succès",
          data: { id: 12 },
        }),
      );
    });

    it("should not validate without images", async () => {
      const task = {
        done: false,
        images: [],
        save: jest.fn(),
      };
      req.body.images = [];
      req.params.id = 1;
      Task.findByPk.mockResolvedValue(task);

      await taskController.validate(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Validation impossible : au moins une image est requise",
      });
    });

    it("should handle DB error", async () => {
      Task.findByPk.mockRejectedValue(new Error("DB error"));
      req.params.id = 99;

      await taskController.validate(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur : DB error" });
    });
  });

  describe("delete", () => {
    it("should delete and respond success", async () => {
      req.params.id = 27;
      Task.destroy.mockResolvedValue(1);

      await taskController.delete(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Tâche supprimée avec succès",
      });
    });

    it("should handle delete error", async () => {
      req.params.id = 27;
      Task.destroy.mockRejectedValue(new Error("Delete error"));

      await taskController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur : Delete error",
      });
    });

    it("should respond 404 if task not found", async () => {
      Task.destroy.mockResolvedValue(0);
      req.params.id = 404;

      await taskController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Tâche non trouvée" });
    });
  });
});
