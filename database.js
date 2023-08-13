// Import necessary libraries
import pgPromise from 'pg-promise';
import pg from 'pg';

// Initialize pg-promise
const pgp = pgPromise();

// Define the database connection string
const connectionString = process.env.DATABASE_URL || 'postgres://bheka:OByrOSiZ7tqz1mAzx72ukmRZNAPr0Iol@dpg-cj5qva2cn0vc73flmoq0-a.oregon-postgres.render.com/razorma_r4tr';
const ssl = { rejectUnauthorized: false }

// Connect to the database using pgp
const db = pgp({ connectionString, ssl });

const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false 
  }
});


// Define a function to create the towns and registration_numbers tables
async function createRegTable() {
  try {
    // query that creates the towns table if it doesn't exist
    const createTableTowns = `
      CREATE TABLE IF NOT EXISTS towns (
        id serial PRIMARY KEY,
        town_name varchar(255) NOT NULL
      );
    `;
    // query that creates the registration_numbers table if it doesn't exist
    const createTableRegNumbers = `
      CREATE TABLE IF NOT EXISTS registration_numbers (
        id serial PRIMARY KEY,
        registration_number varchar(20) NOT NULL,
        town_id int REFERENCES towns(id) ON DELETE CASCADE
    );
    `;
    // Execute queries to create tables

    await db.none(createTableTowns);
    await db.none(createTableRegNumbers);
    // console.log('Table "towns" created successfully.');

    //query to insert towns if they don't already exist
    const putTowns = `
      INSERT INTO towns (town_name)
      SELECT * FROM (VALUES
        ('paarl'),
        ('Bellville'),
        ('Stellenbosch'),
        ('Malmesbury'),
        ('CapeTown'),
        ('Kuilsriver')
      ) AS new_town(town_name)
      WHERE NOT EXISTS (
        SELECT 1 FROM towns WHERE town_name = new_town.town_name
      );
    `;
 // Check if the unique constraint exists for registration_numbers
    const checkConstraintQuery = `
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'registration_numbers' AND constraint_type = 'UNIQUE';
    `;
    const existingConstraint = await db.oneOrNone(checkConstraintQuery);

    // Insert towns using the putTowns query
    await db.none(putTowns);

    if (!existingConstraint) {
      const addUniqueConstraintQuery = `
        ALTER TABLE registration_numbers ADD CONSTRAINT unique_registration_number UNIQUE (registration_number);
      `;
      await db.none(addUniqueConstraintQuery);
      console.log('Unique constraint added to "registration_number" column.');
    } else {
      console.log('Unique constraint already exists.');
    }

  } catch (error) {
    console.error('Error creating table:', error.message);
  }
}
// Call the function to create tables and add constraints
createRegTable()

// create a function that adds ragistration numbers and gives them the town id

async function addRegistrationNumberForTown(registrationNumber, townName) {
  try {
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
  } catch (error) {
    console.error('Error:', error.message);
  }
}

//create a function that will help me track the tables and the data inside
  async function getTown() {
    try {

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
    } catch (error) {
      console.error('Error getting towns and registration numbers:', error.message);
      throw error;
    }
  }

  // Create a function that will get all the registration numbers that are stored
  async function getRegistrations() {
    try {
  // A query that gets the registration numbers
      const getQuery = `
      SELECT registration_number
      FROM registration_numbers
      `;
      const registrations = await db.query(getQuery);

      return registrations
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // Create a function that will get all the registration numbers for a selected town

  async function getRegistrationNumberForTown(townName) {
    try {
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

    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  //create a function that will remove or delete every registration numbers
  async function removeAllRegNumbers() {
    try {
      // const deleteQuery = `
      //   DELETE FROM towns;
      // `;

//get the registration numbers query

      const deleteQuer = `
        DELETE FROM registration_numbers;
      `;
      // await db.none(deleteQuery);
      await db.none(deleteQuer);
      // console.log('All towns removed successfully.');
  
      // const resetSequenceQuery = `
      //   ALTER SEQUENCE towns_id_seq RESTART WITH 1;
      // `;

    //restart the id of the registrations to one

      const resetSequenceQuer = `
        ALTER SEQUENCE registration_numbers_id_seq RESTART WITH 1;
      `;
      // await db.none(resetSequenceQuery);
      await db.none(resetSequenceQuer);
    } catch (error) {
      console.error('Error removing users:', error.message);
    }
  }
//export all the functions to use for tests and in the server
  export {
    createRegTable,
    getTown,
    addRegistrationNumberForTown,
    getRegistrations,
    getRegistrationNumberForTown,
    removeAllRegNumbers,
  };