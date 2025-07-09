const { authJwt } = require("../middleware");
const controller = require("../controllers/phase.controller");

module.exports = function (app) {
  app.post(
    "/api/phases",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.create,
  );
  app.get("/api/phases", [authJwt.verifyToken], controller.findAll);
  app.get("/api/phases/:id", [authJwt.verifyToken], controller.findOne);
  app.put(
    "/api/phases/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.update,
  );
  app.delete(
    "/api/phases/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.delete,
  );
};
