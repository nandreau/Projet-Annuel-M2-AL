const { authJwt } = require("../middleware");
const controller = require("../controllers/problem.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/problems",
    [authJwt.verifyToken],
    controller.create
  );
  app.get(
    "/api/problems",
    [authJwt.verifyToken],
    controller.findAll
  );
  app.get(
    "/api/problems/:id",
    [authJwt.verifyToken],
    controller.findOne
  );
  app.put(
    "/api/problems/:id",
    [authJwt.verifyToken],
    controller.update
  );
  app.delete(
    "/api/problems/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
