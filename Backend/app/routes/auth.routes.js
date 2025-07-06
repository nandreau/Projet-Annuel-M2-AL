const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
    controller.signup,
  );

  app.post("/api/auth/signin", controller.signin);

  app.get("/api/auth/verify", [authJwt.verifyToken], controller.verify);

  app.post("/api/auth/refresh-token", controller.refreshToken);

  app.post("/api/auth/signout", controller.signout);
};
