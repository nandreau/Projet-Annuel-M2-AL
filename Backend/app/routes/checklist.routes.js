const { authJwt } = require("../middleware");
const controller = require("../controllers/checklist.controller");

module.exports = function (app) {
  app.post(
    "/api/checklist",
    [authJwt.verifyToken, authJwt.isArtisanOrModeratorOrAdmin],
    controller.create,
  );
  app.get("/api/checklist", [authJwt.verifyToken], controller.findAll);
  app.get("/api/checklist/:id", [authJwt.verifyToken], controller.findOne);
  app.put(
    "/api/checklist/:id",
    [authJwt.verifyToken, authJwt.isArtisanOrModeratorOrAdmin],
    controller.update,
  );
  app.delete(
    "/api/checklist/:id",
    [authJwt.verifyToken, authJwt.isArtisanOrModeratorOrAdmin],
    controller.delete,
  );
};
