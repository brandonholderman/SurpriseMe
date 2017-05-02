'use strict'

const fs = require('fs');
const express = require('express');
const pg = require('pg');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const drinkKey = '791f7bb8531446d09af4f98a22a06424';
const conString = process.env.DATABASE_URL + 'drinks';
const client = new pg.Client(conString);
const request = require('superagent');
const drinksURL = 'https://addb.absolutdrinks.com/drinks/?apiKey=791f7bb8531446d09af4f98a22a06424';
client.connect();
client.on('error', err => console.error('ERROR', err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(function(req, res) {
  res.header('Access-Control-Allow-Origin', '.');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
})

app.get('/', (request, response) => response.sendFile('index.html', { root: './public' }));

app.listen(PORT, function () {
  console.log(`Your server is now running on port ${PORT}`);
});

//////// ** DATABASE LOADERS ** ////////
////////////////////////////////////////


//           client.query(
//             `INSERT INTO
//             drinks(id, name, description, ingredients, drinkTypes)
//             VALUES ($1, $2, $3, $4, $5)
//             ON CONFLICT DO NOTHING`,
//             [ele.id, ele.name, ele.description, ele.ingredients, ele.drinkTypes]


//////// ** LOAD DRINKS TO DRINKS TABLE ** ////////
////////////////////////////////////////

function loadDrinks() {
  console.log('load drinks says hi');
  request.get(drinksURL)
  .then(results => {
    let drinksData = results.body.result;
    drinksData.map(drinkObj => {
      // console.log(drinkObj.ingredients);
      // console.log('drinkObj name '+drinkObj.name);
      client.query(
        `INSERT INTO
        drinks(id, name)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING`,
        [drinkObj.id, drinkObj.name]
      )
      .then( function() {
        // let ingredientsData = drinkObj.ingredients.result;
        drinkObj.ingredients.forEach(ingred =>{
          client.query(
            `INSERT INTO
            ingredients(type, id, text, textPlain)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING`,
            [ingred.type, ingred.id, ingred.text, ingred.textPlain]
            )
            //our special function for reltable
            .then(function () {
              client.query(
                `INSERT INTO
                reltable(drinkName, ingredName)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING`,
                [drinkObj.name, ingred.id]
              )

            })
            }
          )








        }) //ends second .then






      }) //ends the drinksdata.map





    }) //ends the first .then







    // .catch(console.error);
  } //ends main function

//////// ** CREATE DRINKS AND INGREDIENTS TABLE ** ////////
////////////////////////////////////////

function loadDB() {

  client.query(`
    CREATE TABLE IF NOT EXISTS
    drinks (
      drink_id SERIAL PRIMARY KEY,
      id VARCHAR(1024) UNIQUE NOT NULL,
      name VARCHAR(1024) UNIQUE NOT NULL
        );
    `)


  client.query(`
    CREATE TABLE IF NOT EXISTS
    ingredients (
      ingredients_id SERIAL PRIMARY KEY,
      type VARCHAR(1024) NOT NULL,
      id VARCHAR(1024) UNIQUE NOT NULL,
      text VARCHAR(1024) UNIQUE NOT NULL,
      textPlain VARCHAR(1024) UNIQUE NOT NULL
    );
    `)

    client.query(`
      CREATE TABLE IF NOT EXISTS
      reltable (
        rel_id SERIAL PRIMARY KEY,
        drinkName VARCHAR(1024) NOT NULL,
        ingredName VARCHAR(1024) NOT NULL
      );
      `)
  .then(loadDrinks)
  .catch(console.error);

}

loadDB();
