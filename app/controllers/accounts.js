"use strict";
const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const Weather = require("../utils/weather");
const sanitizeHtml = require("sanitize-html");
/*
Controller for user accounts
- signup
- login
- update account setting
*/
const Accounts = {
  // controller for first landing page with current weather implemented
  index: {
    auth: false,
    handler: async function (request, h) {
      const location = `Waterford`;
      let report = await Weather.readWeather(location);
      console.log(report);

      function renderCell(row, col, value) {
        const cell = row.insertCell(col);
        cell.innerHTML = value;
      }
      async function renderWeather(report) {
        let table, row;
        table = ("weather-table");
        row = table.insertRow(0);
        renderCell(row, 0, report.feelsLike);
        renderCell(row,1, report.clouds);
        renderCell(row,2, report.windSpeed);
        renderCell(row,3, report.windDirection);
        renderCell(row,4, report.visibility);
        renderCell(row,5, report.humidity);
      }
      return h.view("main", { title: "Welcome to Point of Information", report: report });
    },
  },
  // controller to view the signup page
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Signup to Point of Information" });
    },
  },
  /* When the user clicks on the submit button, the details entered are validated.
  If validated the user is redirected to the home page. Otherwise they will
  be informed of any errors and returned to the signup page.
  */
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        //firstName:Joi.string().regex(/^[A-ZÁÉÍÓÚ][A-Za-zÁÉÍÓÚáéíóú]/).max(20),
        lastName: Joi.string().required(),
        //lastName: Joi.string().regex(/^[A-ZÁÉÍÓÚ][ A-Za-zÁÉÍÓÚáéíóú]/).max(30),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        //password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("signup", {
            title: "Sign up error",
            //  errors: error.details,
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const payload = request.payload;
      //sanitozation of data
      const santitzedFirstname = sanitizeHtml(payload.firstName);
      const sanitizedLastname = sanitizeHtml(payload.lastName);
      const sanitizedEmail = sanitizeHtml(payload.email);
      const sanitizedPassword = sanitizeHtml(payload.password);
      try {
        let user = await User.findByEmail(sanitizedEmail);
        if (user) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }

        const newUser = new User({
          firstName: santitzedFirstname,
          lastName: sanitizedLastname,
          email: sanitizedEmail,
          password: sanitizedPassword,
        });

        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      } catch (err) {
        return h.view("signup", { errors: [{ message: err.message }] });
      }
    },
  },

  // controller to view the login page
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login to Points of Information" });
    },
  },

  /* When the user clicks on the submit button, the details entered are validated.
  If validated the user is redirected to the home page. Otherwise they will
  be informed of any errors and returned to the signup page.
  */
  login: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        //password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h,error) {
        return h
          .view("login", {
            title: "Login error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const payload = request.payload;
      //sanitization of data
      const sanitizedEmail = sanitizeHtml(payload.email);
      const sanitizedPassword = sanitizeHtml(payload.password);
      try {
        let user = await User.findByEmail(sanitizedEmail);
        if (!user) {
          const message = "Email address is not registered";
          throw Boom.unauthorized(message);
        }

        user.comparePassword(sanitizedPassword);
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },

  // controller to show your account settings
  showSettings: {
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        return h.view("settings", { title: "My Settings", user: user });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },

  // controller to update settings
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        //firstName: Joi.string().regex(/^[A-ZÁÉÍÓÚ][A-Za-zÁÉÍÓÚáéíóú]/).max(20),
        lastName: Joi.string().required(),
        //lastName: Joi.string().regex(/^[A-ZÁÉÍÓÚ][ A-Za-zÁÉÍÓÚáéíóú]/).max(30),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        //password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("settings", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        //sanitization of data
        const sanitizedFirstname = sanitizeHtml(userEdit.firstName);
        const sanitizedLastname = sanitizeHtml(userEdit.lastName);
        const sanitizedEmail = sanitizeHtml(userEdit.email);
        const sanitizedPassword = sanitizeHtml(userEdit.password);
        user.firstName = sanitizedFirstname;
        user.lastName = sanitizedLastname;
        user.email = sanitizedEmail;
        user.password = sanitizedPassword;
        await user.save();

        return h.redirect("/settings");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },

// controller to logout and clear the cookies
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
};

module.exports = Accounts;