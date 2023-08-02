const router = require("express").Router();
const throttle = require("express-throttle");

// router.use("/user", throttle({ "rate": "3/s" }));
router.use("/public", throttle({ rate: "6/s" }));
router.use("/swap", throttle({ rate: "5/s" }));
router.use("/asset", throttle({ rate: "3/s" }));

router.use("/user", require("./user.routes"));
router.use("/wallet", require("./wallet.routes"));
router.use("/asset", require("./asset.routes"));
router.use("/manager", require("./manager.routes"));
router.use("/public", require("./public.routes"));
router.use("/swap", require("./swap.routes"));
router.use("/v2", require("./v2"));

// router.use("/seeder", require("./seeder"));

module.exports = router;
