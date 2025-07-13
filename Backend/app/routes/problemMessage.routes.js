const { authJwt } = require("../middleware");
const controller = require("../controllers/problemMessage.controller");

module.exports = function (app) {
  app.post(
    "/api/problemMessages",
    [authJwt.verifyToken, authJwt.isArtisanOrModeratorOrAdmin],
    controller.create,
  );
  app.get("/api/problemMessages", [authJwt.verifyToken], controller.findAll);
  app.get(
    "/api/problemMessages/:id",
    [authJwt.verifyToken],
    controller.findOne,
  );
  app.put(
    "/api/problemMessages/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.update,
  );
  app.delete(
    "/api/problemMessages/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.delete,
  );
};
