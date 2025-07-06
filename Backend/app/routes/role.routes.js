const { authJwt } = require("../middleware");
const controller  = require("../controllers/role.controller");

module.exports = (app) => {
  app.get(
    "/api/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
  );

  app.get(
    "/api/roles/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findOne
  );

  app.post(
    "/api/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );

  app.put(
    "/api/roles/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  app.delete(
    "/api/roles/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
