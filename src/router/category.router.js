const { categoryController } = require("../apps/controllers");

const router = require("express").Router();

router.get("/all", categoryController.getAll);
router.post("/create", categoryController.createOne);

module.exports = router;
