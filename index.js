import express from "express";
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import displayRegNumbers from "./registration_number.js";
import flash from 'express-flash';
import session from 'express-session';


import pgPromise from 'pg-promise';

const pgp = pgPromise();
let app = express();
const regNumbers = displayRegNumbers()
app.use(session({ 
  secret: 'Razorma', 
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// import {getTown} from './database.js';
// getTown()
// Setup the Handlebars view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
let prefix = ""
app.get('/',  function (req, res) {
  
      res.render('home',{
        list:regNumbers.getAllTown(),
        errorMessage:req.flash('error'),
        errorMessageTown:req.flash('errorTown')
      })
  });
  
  
  app.post("/reg_numbers",  function (req, res) {
    const allowed = /^C[FKLAYJ](\s\d{1,6}|\s\d{1,3}-\d{1,3})*$/;
    if(req.body.Reg===""){
      req.flash('error', 'Please enter Registration number');
    }else if(!allowed.test(req.body.Reg.toUpperCase())){
      req.flash('error', "Enter only registrations from Paarl, Bellville, Stellenbosch, Malmesbury, Cape-Town, and Kuilsriver (See the select town Dropdown menu for formats)");
    }
   
    regNumbers.setRegNumber(req.body.Reg)
    if(regNumbers.getRegNumbers().length===0){
      regNumbers.setTown("")
    }else{
      regNumbers.setTown(prefix)
    }
      res.redirect("/")
  });
  app.post("/reg_numbers_filter",  function (req, res) {
    regNumbers.setTown(req.body.town)
    prefix = req.body.town
    let dataname = req.body["data-name"]
    if(regNumbers.getAllTown().length===0){
      if(req.body["data-name"]===""){
        dataname = "All Town"
      }
      req.flash('errorTown',`There are no registration Numbers From ${req.body["data-name"]}`)
    }
      res.redirect('/'); 
  });
  app.get("/counter/:name",  function (req, res) {

      res.render('counter');
  
  });
  
  app.post("/reset",  function (req, res) {

    res.redirect("/")
  });
  
    let PORT = process.env.PORT || 3001;
    
    app.listen(PORT, function(){
      console.log('App starting on port', PORT);
    });
  
  
  
  
//   main().catch((error) => {
//     console.error('An error occurred:', error);
//   });
  