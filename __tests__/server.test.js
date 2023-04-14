'use strict';

const server = require('../src/server');
const { db, cat } = require('../src/auth/models');
const supertest = require('supertest');
const request = supertest(server.app);

beforeAll( async() => {
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

    
  let catData3 = {
    name: 'Hazel',
    age: 15,
    sex: 'female',
    breed: 'Tabby'
  };
  await db.drop();
  await db.sync();

  await cat.create(catData1);
  await cat.create(catData2);
  await cat.create(catData3);
});

afterAll( async() => {
  await db.drop();
});

//v2 tests
describe('Testing authenticated server routes', () => {
  let token, testUser, testFoster, testAdmin,
  admin_res, foster_res, user_res, bad_res;

      //test items
      testUser = {
        username: 'Lassy',
        password: 'Kirk@5',
      };
  
      testFoster = {
        username: 'Writer',
        password: 'Kirk@5',
        role: 'foster',
      };
  
      testAdmin = {
        username: 'Admin',
        password: 'Kirk@5',
        role: 'admin',
      };

  test('Can POST to create an item', async() => {
    admin_res = await request.post('/signup').send(testAdmin);
    token = admin_res.body.token;
    console.log('token', token);

    //POST requests
    user_res = await request.post('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .send(testUser);
    foster_res = await request.post('/api/v2/users')
      .set('Authorization', `Bearer ${token}`)
      .send(testFoster);
    bad_res = await request.post('/api/v2/users')
      .set('Authorization', `Bearer badtoken`)
      .send(testFoster);

    expect(user_res.body.username).toEqual('Lassy');
    expect(foster_res.body.username).toEqual('Writer');
    expect(bad_res.status).toEqual(500);
  });

  test('Can GET all items', async() => {
    foster_res = await request.post('/signin').auth(testFoster.username, testFoster.password);
    token = foster_res.body.token;

    //GET requests
    const user_res2 = await request.get('/api/v2/users')
      .set('Authorization', `Bearer ${token}`);
    const cat_res2 = await request.get('/api/v2/cat')
      .set('Authorization', `Bearer ${token}`);
    const bad_res2 = await request.get('/api/v2/cat')
      .set('Authorization', `Bearer badtoken`);

    expect(user_res2.body.length).toEqual(3);
    expect(cat_res2.body.length).toEqual(3);
    expect(bad_res2.body.length).toBeFalsy();
  });

  test('Can GET all cats for a foster', async() => {
    const foster_cats = await request.get(`/api/v2/users/1/cat`)
      .set('Authorization', `Bearer ${token}`);
    expect(foster_cats.body.length).toEqual(2);
  });

  xtest('Can update item by ID', async() => {  
    let get_cat = await request.get('/api/v2/cat/2')
      .set('Authorization', `Bearer ${token}`);
    get_cat.body.note = "Had diarrhea";

    let update_cat = await request.put('/api/v2/cat/2')
      .set('Authorization', `Bearer ${token}`)
      .send(get_cat.body);

    let get_cat2 = await request.get('/api/v2/cat/2')
      .set('Authorization', `Bearer ${token}`);
    expect(get_cat2.body.note).toEqual('Had diarrhea');


    user_res = await request.post('/signin').auth(testUser.username, testUser.password);
    token = user_res.body.token;

    get_cat = await request.get('/api/v2/cat/2')
    .set('Authorization', `Bearer ${token}`);
    get_cat.body.note = "Had menstruation";

    update_cat = await request.put('/api/v2/cat/2')
      .set('Authorization', `Bearer ${token}`)
      .send(get_cat.body);

    get_cat2 = await request.get('/api/v2/cat/2')
      .set('Authorization', `Bearer ${token}`);

    expect(get_cat2.body.note).toEqual('Had diarrhea');
  });

  xtest('Can delete item by ID', async() => {
    //GET requests
    admin_res = await request.post('/signin').auth(testAdmin.username, testAdmin.password);
    token = admin_res.body.token;
    const res2 = await request.delete(`/api/v2/cat/2`)
      .set('Authorization', `Bearer ${token}`);

    expect(res2.body).toEqual(1);

    user_res = await request.post('/signin').auth(testUser.username, testUser.password);
    token = user_res.body.token;

    const res3 = await request.delete(`/api/v2/cat/2`)
    .set('Authorization', `Bearer ${token}`);

    expect(res2.body).toEqual(1);
    expect(res3.status).toEqual(500);
  });
});
