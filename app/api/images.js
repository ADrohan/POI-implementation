'use strict'

const Poi = require("../models/poi");
const Boom = require("@hapi/boom");
//const Utils = require('../utils/image-store');
const ImageStore = require('../utils/image-store');

const Images = {

  find: {
    auth: false,
    handler: async function(request, h) {
      const response = await ImageStore.getAllImages()
      return response;
    }
  },

  upload: {
    auth: false,
    handler: async function(request, h) {
      const file = request.payload.imagefile;
      if (Object.keys(file).length > 0) {
        const image = await ImageStore.uploadImage(request.payload.imagefile);
        if (image) {
          return h.response(image).code(201);
        }
        return Boom.badImplementation('error creating Image');
      }
    }
  },

  deleteOne: {
    auth: false,
    handler: async function(request, h)
    {
      const response = await ImageStore.deleteImage({ _id: request.params.id });
      if (response.deletedCount == 1)
      {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  },

};

module.exports = Images;
