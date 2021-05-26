"use strict";

const assert = require("chai").assert;
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

// SUITE OF TEST FOR USER API
suite("User API tests", function () {
  let users = fixtures.users;
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
/*
  setup(async function () {
    await poiService.deleteAllUsers();
  });
  teardown(async function () {
    await poiService.deleteAllUsers();
  });
 */

  // testing creating a user
  test("create a user", async function() {
    const returnedUser = await poiService.createUser(newUser);
    assert(_.some([returnedUser], newUser), "returnedUser must be a superset of newUser");
    assert.isDefined(returnedUser._id);
  });

  //testing getting a user
  test("get user", async function() {
    const u1 = await poiService.createUser(newUser);
    const u2 = await poiService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  //testing getting an invalid user
  test("get invalid user", async function() {
    const u1 = await poiService.getUser("1234");
    assert.isNull(u1);
    const u2 = await poiService.getUser("012345678901234567890123");
    assert.isNull(u2);
  });

  // testing for an empty array
  test("get all users empty", async function() {
    await poiService.deleteAllUsers();
    const allUsers = await poiService.getUsers();
    assert.isNull(allUsers);
  });

  //testing deleting a user
  test("delete a user", async function() {
    const u = await poiService.createUser(newUser);
    assert(u._id != null);
    await poiService.deleteOneUser(u._id);
    const deleted = await poiService.getUser(u._id);
    assert(deleted == null);
  });

  // test to return all users after a new user has been created
  test("get all users", async function () {
    await poiService.deleteAllUsers();
    await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    for (let u of users) {
      await poiService.createUser(u);
    }
    const allUsers = await poiService.getUsers();
    console.log(allUsers);
    assert.equal(allUsers.length, users.length + 1 );
  });

  //testing getting user details
  test("get users detail", async function() {
    await poiService.deleteAllUsers();
    const user = await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    for (let u of users) {
      await poiService.createUser(u);
    }

    const testUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    };
    users.unshift(testUser);
    const allUsers = await poiService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), "returnedUser must be a superset of newUser");
    }
  });

  // NOTE: I cannot take credit for the approach of the test below. It is informed by the work of
  // https://github.com/sarahbarron/enterprise-web-dev-poi2-backend/blob/master/test/poi-api-test.js
  test("update a user", async function() {
    await poiService.deleteAllUsers();
    const orgUser = await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    const testUser = await poiService.getUser(orgUser._id);
    console.log(orgUser)
    console.log(orgUser._id)

    const newDetails = {
      firstName: "New",
      lastName: "New",
      email: "m@test.com",
      password: "Pass0Updated"
    };
    const updatedUser = await poiService.updateUser(testUser._id, newDetails);
    console.log(updatedUser);

    const user = await poiService.getUsers()
    console.log(user[0]);
    assert.equal(user[0].firstName, newDetails.firstName, updatedUser.firstName);
    assert.equal(user[0].lastName, newDetails.lastName, updatedUser.lastName);
    assert.equal(user[0].email, newDetails.email, updatedUser.email);
    assert.equal(user[0].password, newDetails.password, updatedUser.password);
  });

})




