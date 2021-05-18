'use strict'

const Poi = require("../models/poi");
const Boom = require("@hapi/boom");
const ImageStore = require('../utils/image-store');

const Images = {

  find: {
    auth: false,
    handler: async function(request, h) {
      const response = await ImageStore.getAllImages()
      return response;
    }
  },

};

module.exports = Images;

