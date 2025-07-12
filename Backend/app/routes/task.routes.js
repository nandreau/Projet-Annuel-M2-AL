const { authJwt } = require("../middleware");
const controller = require("../controllers/task.controller");

module.exports = function (app) {
  app.post(
    "/api/tasks",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.create,
  );
  app.get("/api/tasks", [authJwt.verifyToken], controller.findAll);
  app.get("/api/tasks/:id", [authJwt.verifyToken], controller.findOne);
  app.put(
    "/api/tasks/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.update,
  );
  app.put(
    "/api/tasks/:id/meta",
    [ authJwt.verifyToken, authJwt.isArtisanOrModeratorOrAdmin ],
    controller.updateMeta
  );
  app.put(
    "/api/tasks/:id/validate",
    [ authJwt.verifyToken, authJwt.isArtisanOrModeratorOrAdmin ],
    controller.validate
  );
  app.delete(
    "/api/tasks/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.delete,
  );
};
