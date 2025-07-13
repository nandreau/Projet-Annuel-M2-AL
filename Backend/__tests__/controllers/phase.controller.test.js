jest.mock("../../app/models", () => {
  const createModelMock = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  });
  return {
    Phase: createModelMock(),
  };
});

const phaseController = require("../../app/controllers/phase.controller");

let req, res;
beforeEach(() => {
  jest.clearAllMocks();
  req = { params: {}, query: {}, body: {} };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
});

describe("Phase Controller", () => {
  describe("findAll", () => {
    it("should return all phases", async () => {
      const phases = [{ id: 1 }, { id: 2 }];
      const { Phase } = require("../../app/models");
      Phase.findAll.mockResolvedValue(phases);
      await phaseController.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(phases);
    });

    it("should handle error and respond 500", async () => {
      const err = new Error("Fail");
      const { Phase } = require("../../app/models");
      Phase.findAll.mockRejectedValue(err);
      await phaseController.findAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération : Fail",
      });
    });
  });

  describe("findOne", () => {
    it("should return phase if found", async () => {
      req.params.id = 1;
      const phase = { id: 1, name: "Phase1" };
      const { Phase } = require("../../app/models");
      Phase.findByPk.mockResolvedValue(phase);
      await phaseController.findOne(req, res);
      expect(res.json).toHaveBeenCalledWith(phase);
    });

    it("should return 404 if phase not found", async () => {
      req.params.id = 5;
      const { Phase } = require("../../app/models");
      Phase.findByPk.mockResolvedValue(null);
      await phaseController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Phase non trouvée" });
    });

    it("should handle error and respond 500", async () => {
      req.params.id = 2;
      const err = new Error("Error");
      const { Phase } = require("../../app/models");
      Phase.findByPk.mockRejectedValue(err);
      await phaseController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération : Error",
      });
    });
  });

  describe("create", () => {
    it("should create a new phase and return it", async () => {
      req.body = { name: "Phase1" };
      const newPhase = { id: 3, name: "Phase1" };
      const { Phase } = require("../../app/models");
      Phase.create.mockResolvedValue(newPhase);
      await phaseController.create(req, res);
      expect(Phase.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Phase créée avec succès",
        data: newPhase,
      });
    });

    it("should handle error on create and respond 400", async () => {
      const err = new Error("Create fail");
      const { Phase } = require("../../app/models");
      Phase.create.mockRejectedValue(err);
      await phaseController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la création : Create fail",
      });
    });
  });

  describe("update", () => {
    it("should update phase and return updated object", async () => {
      req.params.id = 1;
      req.body = { name: "NewName" };
      const updatedPhase = { id: 1, name: "NewName" };
      const { Phase } = require("../../app/models");
      Phase.update.mockResolvedValue([1]);
      Phase.findByPk.mockResolvedValue(updatedPhase);
      await phaseController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mise à jour réussie",
        data: updatedPhase,
      });
    });

    it("should return 404 if phase not found to update", async () => {
      req.params.id = 2;
      const { Phase } = require("../../app/models");
      Phase.update.mockResolvedValue([0]);
      await phaseController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Phase non trouvée" });
    });

    it("should handle error on update and respond 400", async () => {
      req.params.id = 3;
      const err = new Error("Update fail");
      const { Phase } = require("../../app/models");
      Phase.update.mockRejectedValue(err);
      await phaseController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour : Update fail",
      });
    });
  });

  describe("delete", () => {
    it("should delete phase and return success message", async () => {
      req.params.id = 4;
      const { Phase } = require("../../app/models");
      Phase.destroy.mockResolvedValue(1);
      await phaseController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "Suppression réussie" });
    });

    it("should return 404 if phase not found to delete", async () => {
      req.params.id = 5;
      const { Phase } = require("../../app/models");
      Phase.destroy.mockResolvedValue(0);
      await phaseController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Phase non trouvée" });
    });

    it("should handle error on delete and respond 500", async () => {
      req.params.id = 6;
      const err = new Error("Delete error");
      const { Phase } = require("../../app/models");
      Phase.destroy.mockRejectedValue(err);
      await phaseController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression : Delete error",
      });
    });
  });
});
