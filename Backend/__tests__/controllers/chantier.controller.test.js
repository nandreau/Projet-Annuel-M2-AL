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
    Chantier: createModelMock(),
    Phase: createModelMock(),
    Task: createModelMock(),
    Assignment: createModelMock(),
    Checklist: createModelMock(),
    User: createModelMock(),
  };
});

jest.mock("../../app/utils/chantier", () => ({
  extractIntervenants: jest.fn(),
}));

const chantierController = require("../../app/controllers/chantier.controller");

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

describe("Chantier Controller", () => {
  describe("create", () => {
    it("should create a new chantier and respond with success", async () => {
      req.body = { title: "New Chantier" };
      const chantier = { id: 1 };
      const { Chantier } = require("../../app/models");
      Chantier.create.mockResolvedValue(chantier);
      await chantierController.create(req, res);
      expect(Chantier.create).toHaveBeenCalledWith({ title: "New Chantier" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Chantier créé avec succès",
        data: chantier,
      });
    });

    it("should handle error during creation and respond with 400", async () => {
      req.body = { title: "Test" };
      const { Chantier } = require("../../app/models");
      const err = new Error("Create fail");
      Chantier.create.mockRejectedValue(err);
      await chantierController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Create fail" });
    });
  });

  describe("findAll", () => {
    it("should return all chantiers for admin user", async () => {
      req.userId = 1;
      const adminUser = { roles: [{ name: "admin" }] };
      const { User, Chantier } = require("../../app/models");
      User.findByPk.mockResolvedValue(adminUser);
      const chantierList = [
        { id: 101, dataValues: {} },
        { id: 102, dataValues: {} },
      ];
      Chantier.findAll.mockResolvedValue(chantierList);
      const extractIntervenants =
        require("../../app/utils/chantier").extractIntervenants;
      extractIntervenants.mockReturnValue([{ id: 5 }]);
      await chantierController.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(chantierList);
    });

    it("should return only client's chantiers for client user", async () => {
      req.userId = 2;
      const clientUser = { roles: [{ name: "client" }] };
      const { User, Chantier } = require("../../app/models");
      User.findByPk.mockResolvedValue(clientUser);
      const chantierList = [{ id: 201, dataValues: {} }];
      Chantier.findAll.mockResolvedValue(chantierList);
      require("../../app/utils/chantier").extractIntervenants.mockReturnValue(
        [],
      );
      await chantierController.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(chantierList);
    });

    it("should return only assigned chantiers for a regular user", async () => {
      req.userId = 3;
      const normalUser = { roles: [{ name: "user" }] };
      const { User, Chantier } = require("../../app/models");
      User.findByPk.mockResolvedValue(normalUser);
      const chantierList = [{ id: 301, dataValues: {} }];
      Chantier.findAll.mockResolvedValue(chantierList);
      require("../../app/utils/chantier").extractIntervenants.mockReturnValue(
        [],
      );
      await chantierController.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(chantierList);
    });

    it("should handle errors and respond with 500", async () => {
      req.userId = 4;
      const user = { roles: [{ name: "admin" }] };
      const { User, Chantier } = require("../../app/models");
      User.findByPk.mockResolvedValue(user);
      const err = new Error("Query failed");
      Chantier.findAll.mockRejectedValue(err);
      await chantierController.findAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération : Query failed",
      });
    });
  });

  describe("findAssignedUsers", () => {
    it("should return all users assigned to the chantier", async () => {
      req.params = { id: "5" };
      const users = [
        { id: 10, name: "Alice" },
        { id: 11, name: "Bob" },
      ];
      const { User } = require("../../app/models");
      User.findAll.mockResolvedValue(users);
      await chantierController.findAssignedUsers(req, res);
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe("findOne", () => {
    it("should return chantier if found", async () => {
      req.params = { id: 15 };
      const chantier = { id: 15, title: "Chantier15", dataValues: {} };
      const { Chantier } = require("../../app/models");
      const { extractIntervenants } = require("../../app/utils/chantier");
      Chantier.findByPk.mockResolvedValue(chantier);
      extractIntervenants.mockReturnValue([]);
      await chantierController.findOne(req, res);
      expect(res.json).toHaveBeenCalledWith(chantier);
    });

    it("should return 404 if chantier not found", async () => {
      req.params = { id: 16 };
      const { Chantier } = require("../../app/models");
      Chantier.findByPk.mockResolvedValue(null);
      await chantierController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Chantier non trouvé" });
    });

    it("should handle errors and respond with 500", async () => {
      req.params = { id: 17 };
      const { Chantier } = require("../../app/models");
      const err = new Error("DB error");
      Chantier.findByPk.mockRejectedValue(err);
      await chantierController.findOne(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération : DB error",
      });
    });
  });

  describe("update", () => {
    it("should update chantier data and return updated chantier", async () => {
      req.params = { id: 20 };
      req.body = { name: "Updated" };
      const updatedChantier = { id: 20, name: "Updated" };
      const { Chantier } = require("../../app/models");
      Chantier.update.mockResolvedValue([1]);
      Chantier.findByPk.mockResolvedValue(updatedChantier);
      await chantierController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mise à jour réussie",
        data: updatedChantier,
      });
    });

    it("should return 404 if chantier not found for update", async () => {
      req.params = { id: 21 };
      req.body = { name: "Name" };
      const { Chantier } = require("../../app/models");
      Chantier.update.mockResolvedValue([0]);
      await chantierController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Chantier non trouvé" });
    });

    it("should handle errors and return 400", async () => {
      req.params = { id: 22 };
      req.body = { name: "Name" };
      const { Chantier } = require("../../app/models");
      const err = new Error("Update error");
      Chantier.update.mockRejectedValue(err);
      await chantierController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour : Update error",
      });
    });
  });

  describe("delete", () => {
    it("should delete chantier and return success message", async () => {
      req.params = { id: 30 };
      const { Chantier } = require("../../app/models");
      Chantier.destroy.mockResolvedValue(1);
      await chantierController.delete(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "Suppression réussie" });
    });

    it("should return 404 if chantier not found to delete", async () => {
      req.params = { id: 31 };
      const { Chantier } = require("../../app/models");
      Chantier.destroy.mockResolvedValue(0);
      await chantierController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Chantier non trouvé" });
    });

    it("should handle errors and return 500", async () => {
      req.params = { id: 32 };
      const { Chantier } = require("../../app/models");
      const err = new Error("Delete error");
      Chantier.destroy.mockRejectedValue(err);
      await chantierController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression : Delete error",
      });
    });
  });
});
