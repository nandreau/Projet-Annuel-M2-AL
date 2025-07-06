const { authJwt } = require("../middleware");
const controller = require("../controllers/chantier.controller");

module.exports = function (app) {
  app.post(
    "/api/chantiers",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create,
  );
  app.get("/api/chantiers", [authJwt.verifyToken], controller.findAll);
  app.get("/api/chantiers/:id", [authJwt.verifyToken], controller.findOne);
  app.put(
    "/api/chantiers/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update,
  );
  app.delete(
    "/api/chantiers/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete,
  );
};
