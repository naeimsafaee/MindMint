const express = require("express");
const useragent = require("express-useragent");
const cors = require("cors");
const morgan = require("morgan");
// call and set all providers
require("../providers");
const config = require("config");

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const IntegrationsValue = require("@sentry/integrations");

module.exports = (app) => {

    if (config.get("app.logger.morgan.enable"))
        app.use(morgan(config.get("app.logger.morgan.format")));

    let isDev = process.env.NODE_ENV === "development";
    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    if (!isDev) {
        Sentry.init({
            dsn: "https://d89f80679e814b029c9451b0c1fbdc60@o4504661856026624.ingest.sentry.io/4504723088736256",
            integrations: [
                // enable HTTP calls tracing
                new Sentry.Integrations.Http({ tracing: true }),
                // enable Express.js middleware tracing
                new Tracing.Integrations.Express({ app }),
                new IntegrationsValue.CaptureConsole(
                    {
                        // array of methods that should be captured
                        // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
                        levels: ['log', 'info', 'warn', 'error', 'debug', 'assert']
                    }
                )
            ],
            debug: isDev,
            release: "gamecenter" + ":" + process.env.npm_package_version,
            environment: isDev ? "development" : "production",
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });
        app.use(
            Sentry.Handlers.requestHandler({
                ip: true,
                user: ["id"],
            }),
        );

        // TracingHandler creates a trace for every incoming request
        app.use(Sentry.Handlers.tracingHandler());

    }

    app.set("trust proxy", 1);

    app.use(useragent.express());

    app.use(
        cors({
            origin: "*",
            credentials: true
        })
    );

    app.use(
        express.urlencoded({
            limit: "50mb",
            extended: true,
            parameterLimit: 50
        })
    );

    app.use(express.json({ limit: "50mb" }));
    app.use(require("cookie-parser")());

    app.enable("strict routing");

    app.use(Sentry.Handlers.errorHandler());

    app.use(function (error, req, res, next) {
        if (error instanceof SyntaxError) {
            return res.status(415).send({ data: "Invalid data" });
        } else {
            next();
        }
    });

    app.use(function (req, res, next) {
        if (req.method === "OPTIONS") {
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "*";
            headers["Access-Control-Allow-Methods"] = "OPTIONS";
            headers["Access-Control-Allow-Headers"] = "*";
            res.writeHead(200, headers);
            res.end();
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", true);
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            next();
        }
    });
};
