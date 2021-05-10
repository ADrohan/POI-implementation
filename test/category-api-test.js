"use strict";

const assert = require("chai").assert;
const axios = require("axios");

suite("Category API tests", function () {
  test("get categories", async function () {
    const response = await axios.get("http://localhost:3000/api/categories");
    const categories = response.data;
    assert.equal(4, categories.length);
   // console.log(response.data);
    //assert.equal(1, 1);
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
});