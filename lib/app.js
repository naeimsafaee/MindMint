require("express-async-errors");
const express = require("express");
const { publicController } = require("./endpoints/controllers");
const app = express();

// register hook containers
global.containers = {};

app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(express.json());

require("./middlewares").appMiddlewares(app);
app.use("/api", require("./endpoints/routes"));

app.get("/nft/:filename", publicController.attributes);

app.use(require("./middlewares/errorMiddleware"));

module.exports = app;
