const { db, cat, users } = require('./src/auth/models/');

db.drop().then(() => db.sync()).then(() => {
  let catData1 = {
    name: "Marshmellow",
    age: 8,
    sex: "M",
    breed: "Siamese",
    user_Id: 1,
  };

  let catData2 = {
    name: "Graham",
    age: 4,
    sex: "F",
    breed: "American Longhair",
    user_Id: 1,
  };

    
  let catData3 = {
    name: 'Hazel',
    age: 15,
    sex: 'female',
    breed: 'Tabby'
  };

  let catData4 = {
    name: 'Low Rider', 
    age: 5,
    sex: 'male',
    breed: 'Lion'
  }

  let catData5 = {
    name: 'Luke', 
    age: 2,
    sex: 'male',
    breed: 'Dragon'
  }

  let userData1 = {
    username: 'Test',
    password: 'password',
    role: 'foster'
  };

  cat.create(catData1);
  cat.create(catData2);
  cat.create(catData3);
  cat.create(catData4);
  cat.create(catData5);

  users.create(userData1);
});