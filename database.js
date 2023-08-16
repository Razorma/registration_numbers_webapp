

export default function registrationNumbers(db,create){

 // create the towns and registration_numbers tables
 async function createRegTable() {
  try{
    await db.none(create);
  }catch(error){
    console.log("error",message.error)
  }   
}


  // create a function that adds ragistration numbers and gives them the town id
  async function addRegistrationNumberForTown(registrationNumber, townName) {

      // Retrieve the town_id for the specified town name
      const getTownIdQuery = `
        SELECT id FROM towns WHERE town_name = $1;
      `;
      const result = await db.query(getTownIdQuery, [townName]);
      // console.log('Query result:', result);
  
      if (!result || result.length === 0) {
        console.log(`Town with name '${townName}' not found.`);
        return;
      }
  
      const townIdValue = result[0].id;
      
      // Insert the registration number associated with the specified town name
      const insertQuery = `
        INSERT INTO registration_numbers (town_id, registration_number)
        VALUES ($1, $2);
      `;
      
      await db.query(insertQuery, [townIdValue, registrationNumber]);
      // console.log(`Registration number '${registrationNumber}' added for town '${townName}'.`);
  }
  
  //create a function that will help me track the tables and the data inside
    async function getTown() {
  
        // A query that checks the tables in relations to each other
        const query = `
          SELECT t.id AS town_id, t.town_name, rn.registration_number
          FROM towns t
          LEFT JOIN registration_numbers rn ON t.id = rn.town_id;
        `;
  
        // A query that checks the towns in the towns table
        const queryT = `
          SELECT *
          FROM towns 
        `;
  
        // A query that checks the registrations in the registration_numbers table
        const queryR = `
        SELECT *
        FROM registration_numbers
        `;
        const townsAndRegistrationNumbers = await db.any(query);
        // const tsble = await db.any(queryT);
        // const tsbleReg = await db.any(queryR);
        return townsAndRegistrationNumbers;

    }
  
    // Create a function that will get all the registration numbers that are stored
    async function getRegistrations() {
    // A query that gets the registration numbers
        const getQuery = `
        SELECT registration_number
        FROM registration_numbers
        `;
        const registrations = await db.query(getQuery);
  
        return registrations
    }
  
    // Create a function that will get all the registration numbers for a selected town
  
    async function getRegistrationNumberForTown(townName) {
    // A query that will get the town id using the town name that was entered
        const getTownIdQuery = `
          SELECT id FROM towns WHERE town_name = $1;
        `;
        const result = await db.query(getTownIdQuery, [townName]);
  
    // check if the townname exists
        if (!result || result.length === 0) {
          console.log(`Town with name '${townName}' not found.`);
          return;
        }
  
    // set a variable and initialise it wi the town id
  
        const townIdValue = result[0].id;
        
    
    
        // Insert the registration number associated with the specified town name
        const getQuery = `
        SELECT registration_number
        FROM registration_numbers
        WHERE town_id = ${townIdValue}
        `;
        
        const registrations = await db.query(getQuery, [townIdValue]);
        return registrations
  
    }
  
    //create a function that will remove or delete every registration numbers
    async function removeAllRegNumbers() {
        // const deleteQuery = `
        //   DELETE FROM towns;
        // `;
  
  //get the registration numbers query
  
        const deleteQuer = `
          DELETE FROM registration_numbers;
        `;
        await db.none(deleteQuer);
        // console.log('All towns removed successfully.');
  
      //restart the id of the registrations to one
  
        const resetSequenceQuer = `
          ALTER SEQUENCE registration_numbers_id_seq RESTART WITH 1;
        `;
  
        await db.none(resetSequenceQuer);
    }

  return {
    createRegTable,
    getTown,
    addRegistrationNumberForTown,
    getRegistrations,
    getRegistrationNumberForTown,
    removeAllRegNumbers,
  };
}


