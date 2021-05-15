"use strict";

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Handlebars = require("handlebars");
const Cookie = require("@hapi/cookie");
const Joi = require("@hapi/joi");
require("./app/models/db");
const env = require("dotenv");
const dotenv = require("dotenv");
const ImageStore = require('./app/utils/image-store');
const utils = require("./app/api/utils.js");

// Cloudinary credentials
const credentials = {
  cloud_name: process.env.name,
  api_key: process.env.key,
  api_secret: process.env.secret
};

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const server = Hapi.server({
  port: process.env.PORT || 3000,
});

async function init() {
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(require('hapi-auth-jwt2'));
  server.validator(require("@hapi/joi"));

  // configure vcloudinary credentials
  ImageStore.configure(credentials);

  //paths to the views, layouts and partials
  server.views({
    engines: {
      hbs: require("handlebars"),
    },
    relativeTo: __dirname,
    path: "./app/views",
    layoutPath: "./app/views/layouts",
    partialsPath: "./app/views/partials",
    layout: true,
    isCached: false,
  });

  // initialize cookie plugin
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
  });
  // define a new strategy
  server.auth.strategy("jwt", "jwt", {
    key: "secretpasswordnotrevealedtoanyone",
    validate: utils.validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  // default strategy
  server.auth.default("session");

  // Initialize routes
  server.route(require("./routes"));
  server.route(require('./routes-api'));
  //start the server
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}
// Error handling
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
