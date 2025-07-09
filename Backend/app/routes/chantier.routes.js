const { authJwt } = require("../middleware");
const controller = require("../controllers/chantier.controller");

module.exports = function (app) {
  app.post(
    "/api/chantiers",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.create,
  );
  app.get("/api/chantiers", [authJwt.verifyToken], controller.findAll);
  app.get("/api/chantiers/:id", [authJwt.verifyToken], controller.findOne);
  app.get('/api/chantiers/:id/assigned-users', [authJwt.verifyToken], controller.findAssignedUsers);
  app.put(
    "/api/chantiers/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.update,
  );
  app.delete(
    "/api/chantiers/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.delete,
  );
};
