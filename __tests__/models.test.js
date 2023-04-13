"use strict";

const server = require("../src/server");
const supertest = require("supertest");
const request = supertest(server.app);
const { sequelize, Cat, User } = require("../src/models");
const { response } = require("express");

beforeAll(async () => {
  await sequelize.sync();
  let catData1 = {
    name: "Marshmellow",
    age: 8,
    sex: "M",
    breed: "Siamese",
    note: "",
  };

  let catData2 = {
    name: "Graham",
    age: 4,
    sex: "F",
    breed: "American Longhair",
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



  await Cat.create(catData1);
  await Cat.create(catData2);
  await User.create(userData1);
  await User.create(userData2);
});

afterAll(async () => {
  await sequelize.drop();
});

describe('testing our data models', () => {

  xtest('Can create a user', async () => {
    let newUser = await User.create({
      username: "Jill",
      password: "wonderful",
      role: "foster",
    });

    userId = newUser.id;
    expect(newUser.username).toEqual('Jill');
    expect(newUser.role).toEqual('foster');
    expect(newUser.id).toBeTruthy();
  });

  xtest('Can create a Cat', async () => {
    let newCat = await Cat.create({
      name: "Sprinkles",
      age: 4,
      sex: "F",
      breed: "American Longhair",
      note: "",
      userId: 1
    });

    catId = newCat.id;
    expect(newCat.name).toEqual('Sprinkles');
    expect(newCat.userId).toEqual(1);
  });

  xtest('Can fetch a cat and user', async () => {
    let cat = await Cat.read(catId, {
      include: User.model
    });

    console.log("Cat WITH ASSOCIATION", cat);
    expect(cat.name).toEqual('Sprinkles');
    expect(cat.User.username).toEqual('Trey')
  })

  xtest('Can find cat adopted by foster', async () => {
    const cats = await Cat.findAll({
      include: [{
        model: User,
        where: {
          userId: 1
        }
      }]
    })
    console.log(cats);
    // expect(cats.body[0].name).toEqual
  })

})
