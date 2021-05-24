"use strict";

const assert = require("chai").assert;
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

// TEST SUITE FOR THE POI
suite("Poi API tests", function () {
  let pois = fixtures.pois;
  let newCategory = fixtures.newCategory;
  let newCategory1 = fixtures.newCategory1;
  let newPoi = fixtures.newPoi;
  let newUser = fixtures.newUser;


  const poiService = new PoiService("http://localhost:3000");

  suiteSetup(async function() {
    await poiService.deleteAllUsers();
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function () {
    poiService.deleteAllCategories();
    poiService.deleteAllPois();
  });

  teardown(async function () {});

// test adding a poi by category
  test("add a poi by category", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    await poiService.addPoi(returnedCategory._id, pois[0]);
    const returnedPois = await poiService.getPoiByCategory(returnedCategory._id);
    assert.equal(returnedPois.length, 1);
    assert(_.some([returnedPois[0]], pois[0]), "returned poi must be a superset of poi");
  });

  // test creating multiple pois
  test("create multiple pois by category", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.addPoi(returnedCategory._id, pois[i]);
    }

    const returnedPois = await poiService.getPoiByCategory(returnedCategory._id);
    assert.equal(returnedPois.length, pois.length);
    for (var i = 0; i < pois.length; i++) {
      assert(_.some([returnedPois[i]], pois[i]), "returned poi must be a superset of poi");
    }
  });

  // test deleting all pois by category
  test("delete all pois by category", async function () {
    const returnedCategory = await poiService.createCategory(newCategory);
    for (var i = 0; i < pois.length; i++) {
      await poiService.addPoi(returnedCategory._id, pois[i]);
    }

    const d1 = await poiService.getPoiByCategory(returnedCategory._id);
    assert.equal(d1.length, pois.length);
    await poiService.deleteAllPois();
    const d2 = await poiService.getPoiByCategory(returnedCategory._id);
    assert.equal(d2.length, 0);
  });

  // test deleting a poi by category
  test("delete one poi by category", async function() {
    const returnedCategory = await poiService.createCategory(newCategory);
    await poiService.addPoi(returnedCategory._id, pois[0]);
    const returnedPoi = await poiService.getPoiByCategory(returnedCategory._id);
    assert.equal(returnedPoi.length, 1);

    await poiService.deleteOnePoi(returnedPoi._id);
    const poi = await poiService.getPoiByCategory(returnedPoi._id);
    assert(poi == null);
  });

  // Delete a Poi
  test('delete one poi', async function ()
  {
    let p = await poiService.create(newPoi);
    await poiService.deleteOnePoi(p._id);
    const p2 = await poiService.getPoi(p._id);
    console.log(p2);
    assert(p2 == null);
  });

//  test creating a new poi with no category
  test('create one poi', async function ()
  {
    const returnedPoi = await poiService.create(newPoi);
    assert(_.some([returnedPoi], newPoi),
      'returnedPoi must be a subset of newPoi');
    assert.isDefined(returnedPoi._id);
  });

  //  test creating a new poi with a category
  test('create one poi with a category', async function ()
  {
    const returnedCategory = await poiService.createCategory(newCategory);
    const returnedPoi = await poiService.createPoiWithCat(returnedCategory._id, newPoi)
    console.log(returnedPoi);
    assert(_.some([returnedPoi], newPoi),
      'returnedPoi must be a subset of newPoi');
    assert.isDefined(returnedPoi._id);
  });

  // test getting a poi
  test('get one poi', async function ()
  {
    const p1 = await poiService.create(newPoi);
    const p2 = await poiService.getPoi(p1._id);
    assert.deepEqual(p1, p2);
  });

  // test getting all pois
  test('get all pois', async function ()
  {
    for(let p of pois){
      await poiService.create(p);
    }
    const allPois = await poiService.getPois();
    assert.equal(allPois.length, pois.length);
  });

  // test getting an invalid poi
  test('get invalid poi', async function ()
  {
    const p1 = await poiService.getPoi('1234');
    assert.isNull(p1);
    const p2 = await poiService.getPoi('12345678912345676788');
    assert.isNull(p2);
  });

  // test getting poi details
  test('get pois detail', async function ()
  {
    for(let p of pois){
      await poiService.create(p);
    }
    const returnedPois = await poiService.getPois();
    for(var i=0; i<pois.length; i++)
    {
      assert(_.some([returnedPois[i]], pois[i]),
        'returnedPois must be a subset of newPoi');
    }
  });

  // update a poi
  test('Update a Poi', async function (){

    const category = await poiService.createCategory(newCategory);
    const poi = {
      "name": newPoi.name,
      "description": newPoi.description,
      "location": newPoi.location,
      "category": category
    }
    const initialPoi = await poiService.createPoiWithCat(category._id, poi);
    console.log(initialPoi);
    const catChange = await poiService.createCategory(newCategory1);
    const updatedPoi = {
      "name": 'updated',
      "description": 'updated',
      "location": 'updated',
      "category": catChange
    }
    console.log(updatedPoi);
    const newDetails = await poiService.updatePoi(initialPoi._id, updatedPoi);
    console.log(newDetails);
    const pois = await poiService.getPois();
    assert.equal(pois[0].name, newDetails.name, updatedPoi.name);
    assert.equal(pois[0].description, newDetails.description, updatedPoi.description);
    assert.equal(pois[0].location, newDetails.location, updatedPoi.location);
    assert.equal(pois[0].category, newDetails.category, updatedPoi.category);
  });

  // test getting empty array
  test('get all empty pois', async function ()
  {
    const pois = await poiService.getPois();
    assert.equal(pois.length,0);
  });

});