const { authJwt } = require("../middleware");
const controller  = require("../controllers/role.controller");

module.exports = (app) => {
  app.get(
    "/api/roles",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.findAll
  );

  app.get(
    "/api/roles/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.findOne
  );

  app.post(
    "/api/roles",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.create
  );

  app.put(
    "/api/roles/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.update
  );

  app.delete(
    "/api/roles/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.delete
  );
};
