"use strict";

const Poi = require("../models/poi");
const User = require("../models/user");
const Category = require("../models/category");
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const ImageStore = require('../utils/image-store');
const sanitizeHtml = require("sanitize-html");

const Pois = {
  // controller for home page
  home: {
    handler: async function (request, h) {
      const categories = await Category.find().lean();
      return h.view("home", { title: "Add a Poi", categories: categories });
    },
  },
  // controller for listing all pois
  allpois: {
    handler: async function (request, h) {
      try {
        const allImages = await ImageStore.getAllImages();
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        const poiList = await Poi.find({user:user}).populate("user").populate("category").lean();
        return h.view("allpois", {
          title: "Pois so far",
          pois: poiList,
          images: allImages
        });
      }catch (err) {
        return h.view( 'login', { errors: [{ message: err.message }] });
      }
    }
  },
  // controller for adding a poi

  addpoi: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        category: Joi.string().required(),
        imagefile: Joi.object().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("home", {
            title: "Add poi error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },

    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const payload = request.payload;
        const rawCategory = request.payload.category;
        const category = await Category.findOne({
          name: rawCategory,
        });
        // sanitization
        const santitzedName = sanitizeHtml(payload.name);
        const santitzedDescription = sanitizeHtml(payload.description);
        const sanitizedLocation = sanitizeHtml(payload.location);

        const newPoi = new Poi({
          name: santitzedName,
          description: santitzedDescription,
          location: sanitizedLocation,
          category: category._id,
          user: user._id,
        });

        console.log(newPoi);
        await newPoi.save();

        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          await ImageStore.uploadImage(file)
        }

        return h.redirect("/allpois");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true
    }
  },

  // controller for deleting a poi
  deletepoi: {
    handler: async function (request, h)
    {
      try {
        const poi_id = request.params.id;
        await Poi.findByIdAndDelete(poi_id);
        return h.redirect("/allpois");
      } catch (err) {
        return h.view('login', {errors: [{message: err.message}]});
      }
    }
  },

  // controller for showing the current settings for a specific poi
  showpoi: {
    handler: async function (request, h)
    {
      try
      {
        const poi_id = request.params.id;
        const category = await Category.find().lean();
        const poi = await Poi.findById(poi_id).populate('category').lean();
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();

        return h.view('poisettings', { title: 'Update POI', poi: poi, categories: category, user: user  });
      } catch (err)
      {
        return h.view('login', {errors: [{message: err.message}]});
      }
    }
  },

  // controller to update a poi
  updatepoi: {
    // joi validation of fields
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        category: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h.view("poisettings", { title: "Error updating Poi", errors: error.details, })
          .takeover()
          .code(400);
      },
    },
    //assign new data to each field if joi validation passes.
    handler: async function (request, h) {
      try {
        const userEdit = request.payload;
        const poi_id = request.params.id;
        const poi= await Poi.findById(poi_id);
        const user_id = request.auth.credentials.id;
        const user = await User.findById(user_id);
        const rawCategory = userEdit.category;
        const category = await Category.findOne({
          name: rawCategory
        }).lean();

        //sanitization of data
        const sanitizedName = sanitizeHtml(userEdit.name);
        const sanitizedDescription = sanitizeHtml(userEdit.description);
        const sanitizedLocation = sanitizeHtml(userEdit.location);
        poi.name = sanitizedName;
        poi.description = sanitizedDescription;
        poi.location = sanitizedLocation;
        poi.category = category._id
        poi.user = user._id

        await poi.save();
        return h.redirect("/allpois");
      } catch (err)
      {
        return h.view("allpois",{ errors: [{ message: err.message }] });
      }
    },
  },

};

module.exports = Pois;
