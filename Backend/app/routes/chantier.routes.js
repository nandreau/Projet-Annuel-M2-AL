const { authJwt } = require("../middleware");
const controller = require("../controllers/chantier.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/chantiers",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );
  app.get(
    "/api/chantiers",
    [authJwt.verifyToken],
    controller.findAll
  );
  app.get(
    "/api/chantiers/:id",
    [authJwt.verifyToken],
    controller.findOne
  );
  app.put(
    "/api/chantiers/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
  app.delete(
    "/api/chantiers/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
