const { authJwt } = require("../middleware");
const controller = require("../controllers/problemMessage.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
    );
    next();
  });

  app.post("/api/problemMessages", [authJwt.verifyToken], controller.create);
  app.get("/api/problemMessages", [authJwt.verifyToken], controller.findAll);
  app.get(
    "/api/problemMessages/:id",
    [authJwt.verifyToken],
    controller.findOne,
  );
  app.put("/api/problemMessages/:id", [authJwt.verifyToken], controller.update);
  app.delete(
    "/api/problemMessages/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete,
  );
};
