const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
    );
    next();
  });

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
