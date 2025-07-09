const { authJwt } = require("../middleware");
const controller  = require("../controllers/user.controller");

module.exports = (app) => {
  app.get(
    "/api/users",
    [authJwt.verifyToken],
    controller.findAll
  );
  app.get(
    "/api/users/:id",
    [authJwt.verifyToken],
    controller.findOne
  );
  app.post(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );
  app.put(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
