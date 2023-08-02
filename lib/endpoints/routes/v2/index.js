const router = require("express").Router();

router.use("/swap", require("./swap.routes"));
router.use("/public", require("./public.routes"));

// router.use("/seeder", require("./seeder"));

module.exports = router;
