const { authJwt } = require("../middleware");
const controller = require("../controllers/task.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/tasks",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );
  app.get(
    "/api/tasks",
    [authJwt.verifyToken],
    controller.findAll
  );
  app.get(
    "/api/tasks/:id",
    [authJwt.verifyToken],
    controller.findOne
  );
  app.put(
    "/api/tasks/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
  app.delete(
    "/api/tasks/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
