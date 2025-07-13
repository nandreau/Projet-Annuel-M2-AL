jest.mock("../../app/models", () => {
  const createModelMock = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  });
  return {
    Problem: createModelMock(),
    ProblemMessage: createModelMock(),
    User: createModelMock(),
    Role: createModelMock(),
    Chantier: createModelMock(),
    Phase: createModelMock(),
    Task: createModelMock(),
    Assignment: createModelMock(),
  };
});

const problemController = require("../../app/controllers/problem.controller");

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

describe("Problem Controller", () => {
  describe("findAll", () => {
    it("should return all problems for admin user", async () => {
      req.userId = 1;
      const adminUser = { roles: [{ name: "admin" }] };
      const { User, Problem } = require("../../app/models");
      User.findByPk.mockResolvedValue(adminUser);
      const problems = [{ id: 101 }, { id: 102 }];
      Problem.findAll.mockResolvedValue(problems);
      await problemController.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(problems);
    });

    it("should handle errors and respond with 500", async () => {
      req.userId = 4;
      const modUser = { roles: [{ name: "moderator" }] };
      const { User, Problem } = require("../../app/models");
      User.findByPk.mockResolvedValue(modUser);
      const err = new Error("Query error");
      Problem.findAll.mockRejectedValue(err);
      await problemController.findAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération : Query error",
      });
    });
  });

  describe("findOne", () => {
    it("should return problem if found", async () => {
      req.params = { id: 10 };
      const problem = { id: 10, title: "Issue10" };
      const { Problem } = require("../../app/models");
      Problem.findByPk.mockResolvedValue(problem);
      await problemController.findOne(req, res);
      expect(res.json).toHaveBeenCalledWith(problem);
    });

    it("should return 404 if problem not found", async () => {
      req.params = { id: 11 };
      const { Problem } = require("../../app/models");
      Problem.findByPk.mockResolvedValue(null);
      await problemController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Problème non trouvé" });
    });

    it("should handle error and respond 500", async () => {
      req.params = { id: 12 };
      const err = new Error("DB error");
      const { Problem } = require("../../app/models");
      Problem.findByPk.mockRejectedValue(err);
      await problemController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération : DB error",
      });
    });
  });

  describe("create", () => {
    it("should create a new problem and respond with success message", async () => {
      req.body = { title: "Issue1" };
      const { Problem } = require("../../app/models");
      Problem.create.mockResolvedValue({ id: 1 });
      await problemController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Problème créé avec succès",
        data: { id: 1 },
      });
    });

    it("should handle error on create and respond 400", async () => {
      req.body = { title: "Issue1" };
      const err = new Error("Create err");
      const { Problem } = require("../../app/models");
      Problem.create.mockRejectedValue(err);
      await problemController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la création : Create err",
      });
    });
  });

  describe("updateMeta", () => {
    it("should update metadata", async () => {
      req.params = { id: 5 };
      req.body = { status: "closed", priority: "high", images: [] };
      const { Problem } = require("../../app/models");
      Problem.update.mockResolvedValue([1]);
      const updated = { id: 5, status: "closed", priority: "high", images: [] };
      Problem.findByPk.mockResolvedValue(updated);
      await problemController.updateMeta(req, res);
      expect(res.json).toHaveBeenCalledWith({
        message: "Métadonnées mises à jour",
        data: updated,
      });
    });

    it("should return 404 if not found", async () => {
      req.params = { id: 6 };
      req.body = { status: "open" };
      const { Problem } = require("../../app/models");
      Problem.update.mockResolvedValue([0]);
      await problemController.updateMeta(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Problème non trouvé" });
    });

    it("should handle error", async () => {
      req.params = { id: 7 };
      req.body = { status: "open" };
      const err = new Error("Update fail");
      const { Problem } = require("../../app/models");
      Problem.update.mockRejectedValue(err);
      await problemController.updateMeta(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur : Update fail",
      });
    });
  });

  describe("update", () => {
    it("should update problem and return updated object", async () => {
      req.params = { id: 8 };
      req.body = { title: "New title" };
      const { Problem } = require("../../app/models");
      Problem.update.mockResolvedValue([1]);
      const updatedProblem = { id: 8, title: "New title" };
      Problem.findByPk.mockResolvedValue(updatedProblem);
      await problemController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({
        message: "Problème mis à jour avec succès",
        data: updatedProblem,
      });
    });

    it("should return 404 if problem not found to update", async () => {
      req.params = { id: 9 };
      req.body = { title: "Title" };
      const { Problem } = require("../../app/models");
      Problem.update.mockResolvedValue([0]);
      await problemController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Problème non trouvé" });
    });

    it("should handle error on update and respond 400", async () => {
      req.params = { id: 10 };
      req.body = { title: "Title" };
      const err = new Error("Update error");
      const { Problem } = require("../../app/models");
      Problem.update.mockRejectedValue(err);
      await problemController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour : Update error",
      });
    });
  });

  describe("delete", () => {
    it("should delete problem and return success message", async () => {
      req.params = { id: 15 };
      const { Problem } = require("../../app/models");
      Problem.destroy.mockResolvedValue(1);
      await problemController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "Suppression réussie" });
    });

    it("should return 404 if not found", async () => {
      req.params = { id: 16 };
      const { Problem } = require("../../app/models");
      Problem.destroy.mockResolvedValue(0);
      await problemController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Problème non trouvé" });
    });

    it("should handle error on delete and respond 500", async () => {
      req.params = { id: 17 };
      const err = new Error("Delete error");
      const { Problem } = require("../../app/models");
      Problem.destroy.mockRejectedValue(err);
      await problemController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression : Delete error",
      });
    });
  });
});
