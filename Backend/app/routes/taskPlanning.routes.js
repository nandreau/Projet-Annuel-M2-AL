const { authJwt } = require("../middleware");
const controller = require("../controllers/assignment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/assignments",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );
  app.get(
    "/api/assignments",
    [authJwt.verifyToken],
    controller.findAll
  );
  app.get(
    "/api/assignments/:id",
    [authJwt.verifyToken],
    controller.findOne
  );
  app.put(
    "/api/assignments/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
  app.delete(
    "/api/assignments/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
