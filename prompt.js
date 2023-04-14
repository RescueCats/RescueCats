'use strict';

const prompt = require('prompt-sync')();
const axios = require('axios');
const base64 = require('base-64');

async function rescuePrompt() {
  console.log('Welcome to Rescue Cats!');
  let token, currentUser;
  let not_valid = true;
  
  while (not_valid) {
    const account_input = prompt('Do you have an account? Y/N: ');
    if (account_input.toLowerCase().startsWith('y')) {
      not_valid = false;
      console.log("Let's sign you in!");
      const signin_user = prompt('What is your username: ');
      const signin_pass = prompt('What is your password: ');
      const encode = base64.encode(`${signin_user}:${signin_pass}`);
      //axios request
      try {
        let response = await axios.post('http://localhost:3001/signin', {}, {
          headers: {
            'Authorization': `Basic ${encode}`
          }
        });
        token = response.data.token;
        currentUser = response.data;
      } catch (e) {
        console.log('Invalid credentials, please try again.');
        console.log('');
        not_valid = true;
      }
    } else if (account_input.toLowerCase().startsWith('n')) {
      not_valid = false;
      console.log("Let's make you an account!");
      const signup_user = prompt('What is your username: ');
      const signup_pass = prompt('What is your password: ');
      //axios request
      let response = await axios.post('http://localhost:3001/signup', {
        username: signup_user,
        password: signup_pass,
      });
      token = response.data.token;
      currentUser = response.data;
    } else {
      console.log('Please give a valid input');
    }
  }
  const all_cats = await axios.get('http://localhost:3001/api/v2/cat', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  console.log('');
  console.log('Here are all the cats: ');
  for (let i = 0; i < all_cats.data.length; i++) {
    let string = `Name: ${all_cats.data[i].name} / Breed: ${all_cats.data[i].breed}`;
    console.log(string);
  }
  if (currentUser.role === 'foster') {
    const foster_cats = await axios.get(`http://localhost:3001/api/v2/users/${currentUser.id}/cat`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (foster_cats.data.length) {
      console.log('');
      console.log('Here are the cats you fostered:');
      for (let i = 0; i < foster_cats.data.length; i++) {
        let string = `Name: ${foster_cats.data[i].name} / Breed: ${foster_cats.data[i].breed}`;
        console.log(string);
      }
    }
  }
}

rescuePrompt();
