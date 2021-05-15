"use strict";

const Category = require('../models/category');
const Poi = require("../models/poi");
const Boom = require("@hapi/boom");


const Pois = {
  find: {
    auth: false,
    handler: async function (request, h) {
      const pois = await Poi.find();
      return pois;
    },
  },
  findOne: {
    auth: false,
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

  findByCategory: {
    auth: false,
    handler: async function (request, h) {
      const pois = await Poi.find({ category: request.params.id });
      return pois;
    },
  },

  createByCategory: {
    auth: false,
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

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await Poi.deleteMany({});
      return { success: true };
    },
  },

  deleteOne:{
    auth: false,
    handler: async function(request, h){
      const response = await Poi.findByIdAndDelete({_id: request.params.id});
      if (response)
      {
        return {success: true};
      }
      return Boom.notFound('Id not found');
    }
  },

  create: {
    auth:false,
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
};

module.exports = Pois;