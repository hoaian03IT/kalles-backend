const { authController } = require("../apps/controllers");
const router = require("express").Router();
const authenticate = require("../apps/middlewares/authenticate");

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", authenticate, authController.signOut);
router.get("/refresh-token", authController.refreshToken);

module.exports = router;
