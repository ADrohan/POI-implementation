'use strict';

const ImageStore = require('../utils/image-store');
/*
Controller for image and the gallery
users can upload and delete images.
 */

const Gallery = {
  showAllImages: {
    handler: async function(request, h) {
      try {
        const allImages = await ImageStore.getAllImages();
        return h.view('gallery', {
          title: 'Cloudinary Gallery',
          images: allImages
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  deleteImage: {
    handler: async function(request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);
        return h.redirect('/allpois');
      } catch (err) {
        console.log(err);
      }
    }
  }
};

module.exports = Gallery;