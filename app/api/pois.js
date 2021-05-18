"use strict";

const Category = require('../models/category');
const Poi = require("../models/poi");
const User = require("../models/user");
const Boom = require("@hapi/boom");


const Pois = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const pois = await Poi.find();
      return pois;
    },
  },
  //find one Poi
  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const poi = await Poi.findOne({ _id: request.params.id });
        if (!poi) {
          return Boom.notFound("No poi with this id");
        }
        return poi;
      } catch (err) {
        return Boom.notFound("No poi with this Id");
      }
    }
  },
  //find by category
  findByCategory: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const pois = await Poi.find({ category: request.params.id });
      return pois;
    },
  },
  //create by category
  createByCategory: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      let poi = new Poi(request.payload);
      const category = await Category.findOne({ _id: request.params.id });
      if (!category) {
        return Boom.notFound("No Category with this id");
      }
      poi.category = category._id;
      poi = await poi.save();
      return poi;
    },
  },
  // delete all pois
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await Poi.deleteMany({});
      return { success: true };
    },
  },
  //delete one poi
  deleteOne:{
    auth: false,
    handler: async function(request, h){
      const response = await Poi.deleteOne({_id: request.params.id});
      if (response)
      {
        return {success: true};
      }
      return Boom.notFound('Id not found');
    }
  },
  //create a new poi
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h){
      const newPoi = new Poi(request.payload);
      const poi = await newPoi.save();
      if(poi)
      {
        return h.response(poi).code(201);
      }
      return Boom.badImplementation('error creating poi');
    }
  },

  /// find by user
  findByUser: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        const poi = await Poi.find( { user: user });
        if (!poi){
          return Boom.notFound("No poi with this user ID");
        }
        return poi;
      }
      catch (err) {
        return Boom.notFound("Error finding poi with this User ID");
      }
    }
  },
};

module.exports = Pois;