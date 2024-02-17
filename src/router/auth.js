const { authController } = require("../apps/controllers");
const router = require("express").Router();
const auth = require("../apps/middlewares/auth");

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", auth, authController.signOut);
router.get("/refresh-token", authController.refreshToken);

module.exports = router;
