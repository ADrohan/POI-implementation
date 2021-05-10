"use strict";

const assert = require("chai").assert;
//const axios = require("axios");
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require('lodash');

suite("Category API tests", function () {
  let candidates = fixtures.categories;
  let newCategory = fixtures.newCategory;

  const poiService = new PoiService("http://localhost:3000");

  test("create a category", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    assert(_.some([returnedCategory], newCategory), "returnedCategory must be a superset of newCategory");
    //assert.equal(returnedCategory.name, newCategory.name);
    assert.isDefined(returnedCategory._id);
  });
});

/*
suite("Category API tests", function () {
  test("get categories", async function () {
    const response = await axios.get("http://localhost:3000/api/categories");
    const categories = response.data;
    assert.equal(4, categories.length);
  });

  test("get one category", async function () {
    let response = await axios.get("http://localhost:3000/api/categories");
    const categories = response.data;
    assert.equal(4, categories.length);

    const oneCategoryUrl = "http://localhost:3000/api/categories/" + categories[0]._id;
    response = await axios.get(oneCategoryUrl);
    const oneCategory = response.data;

    assert.equal(oneCategory.name, "urban");
  });

  test("create a category", async function () {
    const categoriesUrl = "http://localhost:3000/api/categories";
    const newCategory = {
      name: "lakes",
    };

    const response = await axios.post(categoriesUrl, newCategory);
    const returnedCategory = response.data;
    assert.equal(201, response.status);

    assert.equal(returnedCategory.name, "lakes");
  });

  test("delete a category", async function () {
    let response = await axios.get("http://localhost:3000/api/categories");
    let categories = response.data;
    const originalSize = categories.length;

    const oneCategoryUrl = "http://localhost:3000/api/categories/" + categories[0]._id;
    response = await axios.get(oneCategoryUrl);
    const oneCategory = response.data;
    assert.equal(oneCategory.name, "urban");

    response = await axios.delete("http://localhost:3000/api/categories/" + categories[0]._id);
    assert.equal(response.data.success, true);

    response = await axios.get("http://localhost:3000/api/categories");
    categories = response.data;
    assert.equal(categories.length, originalSize - 1);
  });

  test("delete all categories", async function () {
    let response = await axios.get("http://localhost:3000/api/categories");
    let categories = response.data;
    const originalSize = categories.length;
    assert(originalSize > 0);
    response = await axios.delete("http://localhost:3000/api/categories");
    response = await axios.get("http://localhost:3000/api/categories");
    categories = response.data;
    assert.equal(categories.length, 0);
  });

});
*/
