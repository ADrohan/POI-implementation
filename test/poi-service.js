"use strict";

const axios = require("axios");
const baseUrl = "http://localhost:3000";

class PoiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // get all categories
  async getCategories() {
    try {
      const response = await axios.get(this.baseUrl + "/api/categories");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  // get a category by id
  async getCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/categories/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  // create a new category
  async createCategory(newCategory) {
    try {
      const response = await axios.post(this.baseUrl + "/api/categories", newCategory);
      return response.data;
    }catch (e) {
      return null;
    }
  }

  //delete all categories
  async deleteAllCategories() {
    try{
    const response = await axios.delete(this.baseUrl + "/api/categories");
    return response.data;
  }
  catch(e) {
    return null;
  }
}

// delete a category by id
  async deleteOneCategory(id)
{
  try {
    const response = await axios.delete(this.baseUrl + "/api/categories/" + id);
    return response.data;
  } catch (e) {
    return null;
  }
}
//get one user by id
  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
// get all users
  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

//create a new user
  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users", newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

// delete all users
  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

// delete user by id
  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  //  add a poi to a category
  async addPoi(id, poi) {
    try {
      const response = await axios.post(this.baseUrl + "/api/categories/" + id + "/pois", poi);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  // get pois by category
  async getPoiByCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/categories/" + id + "/pois");
      return response.data;
    } catch (e) {
      return null;
    }
  }
// get all pois
  async getPois() {
    try {
      const response = await axios.get(this.baseUrl + "/api/pois");
      return response.data;
    } catch (e) {
      return null;
    }
  }
//get poi by id
  async getPoi(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/pois/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
  //delete all pois
  async deleteAllPois() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/pois");
      return response.data;
    } catch (e) {
      return null;
    }
  }
  //delete one poi by id
  async deleteOnePoi(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/pois" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
  // create a new poi
  async create(newPoi){
    try {
      const response = await axios.post(this.baseUrl + '/api/pois', newPoi);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  // Poi - find by user

  // IMAGESto do
  // get images
  // upload image
  // delete an image
  // fixtures image


}

module.exports = PoiService;