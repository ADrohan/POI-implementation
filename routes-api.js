const Categories = require('./app/api/categories');
const Users = require("./app/api/users");
const Pois = require("./app/api/pois");

module.exports = [
  { method: 'GET', path: '/api/categories', config: Categories.find }, //working
  { method: 'GET', path: '/api/categories/{id}', config: Categories.findOne }, // working
  { method: "POST", path: "/api/categories", config: Categories.create }, //working
  { method: "DELETE", path: "/api/categories/{id}", config: Categories.deleteOne }, //working
  { method: "DELETE", path: "/api/categories", config: Categories.deleteAll }, //working

  { method: "GET", path: "/api/users", config: Users.find }, //working
  { method: "GET", path: "/api/users/{id}", config: Users.findOne }, //working
  { method: "POST", path: "/api/users", config: Users.create }, //working
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne }, //working
  { method: "DELETE", path: "/api/users", config: Users.deleteAll }, //working

  { method: "GET", path: "/api/pois", config: Pois.find }, // working
  { method: "GET", path: "/api/categories/{id}/pois", config: Pois.findByCategory }, //working
  { method: "POST", path: "/api/categories/{id}/pois", config: Pois.createByCategory }, //working
  { method: "POST", path: "/api/pois", config: Pois.create }, //working
  { method: "DELETE", path: "/api/pois", config: Pois.deleteAll }, // working
  { method: 'DELETE', path: '/api/pois/{id}', config: Pois.deleteOne }, // 404 id not found
  { method: 'GET', path: '/api/pois/{id}', config: Pois.findOne }, // working
 // { method: 'GET', path: 'api/poi/user', config: Pois.findByUser} // poi-service & tests to do

 // { method: 'GET', path: '/api/images', config: Images.find } // tests to do
  //{ method: 'POST', path: '/api/images', config: Images.upload } // tests to do
  //{ method: 'DELETE', path: '/api/images/{id}', config: Images.delete } // tests to do
];