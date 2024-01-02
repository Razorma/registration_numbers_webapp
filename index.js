// Import necessary libraries
import express from "express";
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import displayRegNumbers from "./registration_number.js";
import flash from 'express-flash';
import session from 'express-session';
import pgPromise from 'pg-promise';
import fs from 'fs';

// Initialize pg-promise
const pgp = pgPromise();

//get the queries from the tables file 

const sqlTableQueries = fs.readFileSync('tables.sql', 'utf-8');

// Define the database connection string
const connectionString = process.env.DATABASE_URL || 'postgres://tqaqpevb:ZSSpm1kgUg30_o7NzKfxgamjI5uNls3n@mel.db.elephantsql.com/tqaqpevb';
const ssl = { rejectUnauthorized: false }

// Connect to the database using pgp
const db = pgp({ connectionString, ssl });
// Create an Express app instance
let app = express();
export {sqlTableQueries,db}
// Configure Express app settings
app.use(session({ 
  secret: 'Razorma', 
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// Import database functions from './database.js'
import registrationNumbers from './database.js';
import RegistrationRoutes from './routes/registrations.js';

//get the ddatabase and routes function
const registrationService = registrationNumbers(db,sqlTableQueries);
const registrationRoutes = RegistrationRoutes(registrationService)

// Setup the Handlebars view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// Define a route to handle GET requests to the root
app.get('/', registrationRoutes.showAdd);

// Define a route to handle POST requests to '/reg_numbers'
app.post("/reg_numbers", registrationRoutes.add);

// Define a route to handle POST requests to '/reg_numbers_filter'
app.post("/reg_numbers_filter", registrationRoutes.filter);

// Define a route to handle POST requests to '/reset'
app.post("/reset", registrationRoutes.deleteAll);


// Define the port for the server to listen on
let PORT = process.env.PORT || 3001;

// Start the Express server
app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});


