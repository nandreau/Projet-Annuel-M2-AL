const { authJwt } = require("../middleware");
const controller = require("../controllers/taskPlanning.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/taskPlannings",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );
  app.get(
    "/api/taskPlannings",
    [authJwt.verifyToken],
    controller.findAll
  );
  app.get(
    "/api/taskPlannings/:id",
    [authJwt.verifyToken],
    controller.findOne
  );
  app.put(
    "/api/taskPlannings/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
  app.delete(
    "/api/taskPlannings/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
