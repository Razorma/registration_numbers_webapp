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

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
let prefix = ""
let list = []
let town = []
let dataNameFix = ""
app.get('/', async function (req, res) {
  
     
      try {
        if(prefix===""){
          list = await getRegistrations()
        }else if(prefix!==""){
          list = town
        }
        
        res.render('home',{
          list,
          errorMessage:req.flash('error'),
          errorMessageTown:req.flash('errorTown'),
          TownSelected:req.flash('TownSelected'),
          successMessage:req.flash('success')
        })
      } catch (error) {
        console.error('Error:', error.message);
      }
  });
  
  
  app.post("/reg_numbers", async function (req, res) {
    const allowed = /^C[FKLAYJ](\s\d{1,6}|\s\d{1,3}-\d{1,3})*$/;
    if(req.body.Reg===""){
      req.flash('error', 'Please enter Registration number');
    }else if(!allowed.test(req.body.Reg.toUpperCase())){
      req.flash('error', "Enter only registrations from Paarl, Bellville, Stellenbosch, Malmesbury, Cape-Town, and Kuilsriver (See the select town Dropdown menu for formats)");
    }

    regNumbers.setRegNumber(req.body.Reg)
   
    try {
      if(regNumbers.checkTown() !== ""){
        await addRegistrationNumberForTown(regNumbers.getCurrentReg(),regNumbers.checkTown())
      }
      
      if(regNumbers.getRegNumbers().length===0){
        regNumbers.setTown("")
      }else{
        regNumbers.setTown(prefix)
        req.flash('TownSelected',dataNameFix)
        town = await getRegistrationNumberForTown(dataNameFix)
      }
  
    } catch (error) {
      console.error('Error:', error.message);
    }
     
      res.redirect("/")
  });
  
  app.post("/reg_numbers_filter", async function (req, res) {
    let dataname = req.body["data-name"]
    req.flash('TownSelected',dataname)
    prefix = req.body.town

    regNumbers.setTown(req.body.town)
    try {
      if(req.body.town===""){
        await getRegistrations()
        let getRegs = await getRegistrations()
        if(getRegs.length===0){
          req.flash('errorTown',"No registration numbers, Please enter registration numbers")
        }
      }else{
        town = await getRegistrationNumberForTown(dataname)
        dataNameFix = dataname 
        if(town.length===0){
          if(req.body["data-name"]===""){
            dataname = "All Town"
          }
          req.flash('errorTown',`There are no registration Numbers From ${req.body["data-name"]}`)
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
      res.redirect('/'); 
  });

  app.post("/reset",  async function (req, res) {
    try {
      await removeAllRegNumbers()
      req.flash('success', 'Registration numbers successesfully removed from storage.');
    } catch (error) {
      console.error('Error:', error.message);
    }
    res.redirect("/")
  });
  
    let PORT = process.env.PORT || 3001;
    
    app.listen(PORT, function(){
      console.log('App starting on port', PORT);
    });
  
  
  