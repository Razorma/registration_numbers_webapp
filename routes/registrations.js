import displayRegNumbers from "../registration_number.js";

// Initialize the registration number display object

const  regNumbers = displayRegNumbers()



export default function RegistrationRoutes(registrationDatabase){
  // Initialize variables for prefix, list, town, and dataNameFix
  let prefix = ""
  let list = []
  let town = []
  let dataNameFix = ""
    async function showAdd(req, res) {
        try {
          // Conditionally load registration numbers based on prefix
          if (prefix === "") {
            list = await registrationDatabase.getRegistrations();
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
    }

    async function add(req, res) {
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
            await registrationDatabase.addRegistrationNumberForTown(regNumbers.getCurrentReg(), regNumbers.checkTown());
          }
          
          // Update town data based on registration numbers
          if (regNumbers.getRegNumbers().length === 0) {
            regNumbers.setTown("");
          } else {
            regNumbers.setTown(prefix);
            req.flash('TownSelected', dataNameFix);
            town = await registrationDatabase.getRegistrationNumberForTown(dataNameFix);
          }
        } catch (error) {    
          console.error('Error:', error.message);
        }   
        // Redirect to the root
        res.redirect("/");
      }


      async function filter(req, res) {
        // Update data based on town filter
        let dataname = req.body["data-name"];
        req.flash('TownSelected', dataname);
        prefix = req.body.town;
        regNumbers.setTown(req.body.town);
      
        try {
          if (req.body.town === "") {
            await registrationDatabase.getRegistrations();
            let getRegs = await registrationDatabase.getRegistrations();
            if (getRegs.length === 0) {
              req.flash('errorTown', "No registration numbers, Please enter registration numbers");
            }
          } else {
            town = await registrationDatabase.getRegistrationNumberForTown(dataname);
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
      }

      async function deleteAll(req, res) {
        try {
          // Remove all registration numbers from storage
          await registrationDatabase.removeAllRegNumbers();
          req.flash('success', 'Registration numbers successfully removed from storage.');
        } catch (error) {
          console.error('Error:', error.message);
        }
        
        // Redirect to the root
        res.redirect("/");
      }
      return{
        showAdd,
        add,
        filter,
        deleteAll
      }
}