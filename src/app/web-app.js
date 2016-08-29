import express from "express";
import bodyParser from "body-parser";
import { renderFile } from "ejs";
import Hull from "hull";

import AppMiddleware from "../lib/middleware/app";

export default function ({ queueAdapter }) {
  const app = express();
  const middleware = Hull.Middleware({ hostSecret: process.env.SECRET || "1234" });
  app
    .use(bodyParser.json())
    .use((req, res, next) => {
      middleware(req, res, () => {
        next();
      });
    })
    .use(AppMiddleware(queueAdapter));
  app.engine("html", renderFile);
  app.set("views", `${__dirname}/../../views`);
  app.set("view engine", "ejs");

  return app;
}