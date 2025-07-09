const { authJwt } = require("../middleware");
const controller = require("../controllers/assignment.controller");

module.exports = function (app) {
  app.post(
    "/api/assignments",
    [authJwt.verifyToken, authJwt.isArtisanOrModeratorOrAdmin],
    controller.create,
  );
  app.get("/api/assignments", [authJwt.verifyToken], controller.findAll);
  app.get("/api/assignments/:id", [authJwt.verifyToken], controller.findOne);
  app.put(
    "/api/assignments/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.update,
  );
  app.delete(
    "/api/assignments/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.delete,
  );
};
