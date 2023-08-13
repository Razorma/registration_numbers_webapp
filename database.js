import pgPromise from 'pg-promise';
import pg from 'pg';

const pgp = pgPromise();


const connectionString = process.env.DATABASE_URL || 'postgres://bheka:OByrOSiZ7tqz1mAzx72ukmRZNAPr0Iol@dpg-cj5qva2cn0vc73flmoq0-a.oregon-postgres.render.com/razorma_r4tr';
const ssl = { rejectUnauthorized: false }

const db = pgp({ connectionString, ssl });

const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false 
  }
});



async function createRegTable() {
  try {
    const createTableTowns = `
      CREATE TABLE IF NOT EXISTS towns (
        id serial PRIMARY KEY,
        town_name varchar(255) NOT NULL
      );
    `;
    const createTableRegNumbers = `
      CREATE TABLE IF NOT EXISTS registration_numbers (
        id serial PRIMARY KEY,
        registration_number varchar(20) NOT NULL,
        town_id int REFERENCES towns(id) ON DELETE CASCADE
    );
    `;
    await db.none(createTableTowns);
    await db.none(createTableRegNumbers);
    console.log('Table "towns" created successfully.');

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

    const checkConstraintQuery = `
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'registration_numbers' AND constraint_type = 'UNIQUE';
    `;
    const existingConstraint = await db.oneOrNone(checkConstraintQuery);
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
createRegTable()

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

  async function getTown() {
    try {
      const query = `
        SELECT t.id AS town_id, t.town_name, rn.registration_number
        FROM towns t
        LEFT JOIN registration_numbers rn ON t.id = rn.town_id;
      `;
      const queryT = `
        SELECT *
        FROM towns 
      `;
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
  async function getRegistrations() {
    try {

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

  async function getRegistrationNumberForTown(townName) {
    try {

      const getTownIdQuery = `
        SELECT id FROM towns WHERE town_name = $1;
      `;
      const result = await db.query(getTownIdQuery, [townName]);

  
      if (!result || result.length === 0) {
        console.log(`Town with name '${townName}' not found.`);
        return;
      }
  
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

  async function removeAllRegNumbers() {
    try {
      // const deleteQuery = `
      //   DELETE FROM towns;
      // `;
      const deleteQuer = `
        DELETE FROM registration_numbers;
      `;
      // await db.none(deleteQuery);
      await db.none(deleteQuer);
      // console.log('All towns removed successfully.');
  
      // const resetSequenceQuery = `
      //   ALTER SEQUENCE towns_id_seq RESTART WITH 1;
      // `;
      const resetSequenceQuer = `
        ALTER SEQUENCE registration_numbers_id_seq RESTART WITH 1;
      `;
      // await db.none(resetSequenceQuery);
      await db.none(resetSequenceQuer);
    } catch (error) {
      console.error('Error removing users:', error.message);
    }
  }

  export {
    createRegTable,
    getTown,
    addRegistrationNumberForTown,
    getRegistrations,
    getRegistrationNumberForTown,
    removeAllRegNumbers,
  };