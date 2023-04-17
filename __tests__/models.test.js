"use strict";

const server = require("../src/server");
const supertest = require("supertest");
const request = supertest(server.app);
const { db, cat, users } = require("../src/auth/models");

beforeAll(async () => {
  await db.drop();
  await db.sync();
  let catData1 = {
    name: "Marshmellow",
    age: 8,
    sex: "M",
    breed: "Siamese",
    user_Id: 1,
    note: "",
  };

  let catData2 = {
    name: "Graham",
    age: 4,
    sex: "F",
    breed: "American Longhair",
    user_Id: 1,
    note: ""
  };
  let userData1 = {
    username: "Trey",
    password: "password",
    role: "foster",
  }
  let userData2 = {
    username: "Bob",
    password: "secret",
  }



  await cat.create(catData1);
  await cat.create(catData2);
  await users.create(userData1);
  await users.create(userData2);
});

afterAll(async () => {
  await db.drop();
});

describe('testing our data models', () => {
  let user_Id = null;
  let catId = null;
  test('Can create a user', async () => {
    let newUser = await users.create({
      username: "Jill",
      password: "wonderful",
      role: "foster",
    });

    user_Id = newUser.id;
    expect(newUser.username).toEqual('Jill');
    expect(newUser.role).toEqual('foster');
    expect(newUser.id).toBeTruthy();
  });

  test('Can create a Cat', async () => {
    let newCat = await cat.create({
      name: "Sprinkles",
      age: 4,
      sex: "F",
      breed: "American Longhair",
      note: "",
      user_Id: 1
    })
    expect(newCat.name).toEqual('Sprinkles');
  });

  test('Can fetch a cat and user', async () => {
    catId = 3
    let catRead = await cat.read(catId);
    let userRead = await users.read(catRead.user_Id);


    console.log("Cat WITH ASSOCIATION", userRead);
    expect(catRead.name).toEqual('Sprinkles');
    expect(userRead.username).toEqual('Trey')
  })

  test('Can find cat adopted by foster', async () => {
    user_Id = 1
    const cats = await cat.read(null, {
      where: { user_Id: user_Id }
    });
    console.log('$$$$', cats);
    expect(cats.length).toEqual(3);
  })

})
