const Categories = require('./app/api/categories');
const Users = require("./app/api/users");

module.exports = [
  { method: 'GET', path: '/api/categories', config: Categories.find },
  { method: 'GET', path: '/api/categories/{id}', config: Categories.findOne },
  { method: "POST", path: "/api/categories", config: Categories.create },
  { method: "DELETE", path: "/api/categories/{id}", config: Categories.deleteOne },
  { method: "DELETE", path: "/api/categories", config: Categories.deleteAll },

  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },
];