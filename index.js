// Import necessary libraries
import express from "express";
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import displayRegNumbers from "./registration_number.js";
import flash from 'express-flash';
import session from 'express-session';

import pgPromise from 'pg-promise';

// Initialize pg-promise
const pgp = pgPromise();

// Create an Express app instance
let app = express();

// Initialize the registration number display object
const regNumbers = displayRegNumbers();

// Configure Express app settings
app.use(session({ 
  secret: 'Razorma', 
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// Import database functions from './database.js'
import {
  addRegistrationNumberForTown,
  getRegistrations,
  getRegistrationNumberForTown,
  removeAllRegNumbers,
} from './database.js';

// Setup the Handlebars view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Initialize variables for prefix, list, town, and dataNameFix
let prefix = ""
let list = []
let town = []
let dataNameFix = ""

// Define a route to handle GET requests to the root
app.get('/', async function (req, res) {
  try {
    // Conditionally load registration numbers based on prefix
    if (prefix === "") {
      list = await getRegistrations();
    } else if (prefix !== "") {
      list = town;
    }
    
    // Render the home template with data
    res.render('home', {
      list,
      errorMessage: req.flash('error'),
      errorMessageTown: req.flash('errorTown'),
      TownSelected: req.flash('TownSelected'),
      successMessage: req.flash('success')
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
});

// Define a route to handle POST requests to '/reg_numbers'
app.post("/reg_numbers", async function (req, res) {
  // Validate and process the submitted registration number
  const allowed = /^C[FKLAYJ](\s\d{1,6}|\s\d{1,3}-\d{1,3})*$/;
  if (req.body.Reg === "") {
    req.flash('error', 'Please enter Registration number');
  } else if (!allowed.test(req.body.Reg.toUpperCase())) {
    req.flash('error', "Enter only registrations from Paarl, Bellville, Stellenbosch, Malmesbury, Cape-Town, and Kuilsriver (See the select town Dropdown menu for formats)");
  }

  regNumbers.setRegNumber(req.body.Reg);

  try {
    // Add registration number to database if associated with a town
    if (regNumbers.checkTown() !== "") {
      await addRegistrationNumberForTown(regNumbers.getCurrentReg(), regNumbers.checkTown());
    }
    
    // Update town data based on registration numbers
    if (regNumbers.getRegNumbers().length === 0) {
      regNumbers.setTown("");
    } else {
      regNumbers.setTown(prefix);
      req.flash('TownSelected', dataNameFix);
      town = await getRegistrationNumberForTown(dataNameFix);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Redirect to the root
  res.redirect("/");
});

// Define a route to handle POST requests to '/reg_numbers_filter'
app.post("/reg_numbers_filter", async function (req, res) {
  // Update data based on town filter
  let dataname = req.body["data-name"];
  req.flash('TownSelected', dataname);
  prefix = req.body.town;
  regNumbers.setTown(req.body.town);

  try {
    if (req.body.town === "") {
      await getRegistrations();
      let getRegs = await getRegistrations();
      if (getRegs.length === 0) {
        req.flash('errorTown', "No registration numbers, Please enter registration numbers");
      }
    } else {
      town = await getRegistrationNumberForTown(dataname);
      dataNameFix = dataname;
      if (town.length === 0) {
        if (req.body["data-name"] === "") {
          dataname = "All Town";
        }
        req.flash('errorTown', `There are no registration Numbers From ${req.body["data-name"]}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Redirect to the root
  res.redirect('/');
});

// Define a route to handle POST requests to '/reset'
app.post("/reset", async function (req, res) {
  try {
    // Remove all registration numbers from storage
    await removeAllRegNumbers();
    req.flash('success', 'Registration numbers successfully removed from storage.');
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Redirect to the root
  res.redirect("/");
});

// Define the port for the server to listen on
let PORT = process.env.PORT || 3001;

// Start the Express server
app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});


