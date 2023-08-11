// import pgPromise from 'pg-promise';
// import pg from 'pg';

// const pgp = pgPromise();


// const connectionString = process.env.DATABASE_URL || 'postgres://bheka:OByrOSiZ7tqz1mAzx72ukmRZNAPr0Iol@dpg-cj5qva2cn0vc73flmoq0-a.oregon-postgres.render.com/razorma_r4tr';
// const ssl = { rejectUnauthorized: false }

// const db = pgp({ connectionString, ssl });

// const pool = new pg.Pool({
//   connectionString: connectionString,
//   ssl: {
//     rejectUnauthorized: false 
//   }
// });



// async function createUsersTable() {
//     try {
//       const createTableTowns = `
//       CREATE TABLE IF NOT EXISTS towns (
//         id serial PRIMARY KEY,
//         town_name varchar(255) NOT NULL
//       );
//     `;
//     const createTableRegNumbers = `
//       CREATE TABLE IF NOT EXISTS registration_numbers (
//         id serial PRIMARY KEY,
//         registration_number varchar(20) NOT NULL,
//         town_id int REFERENCES towns(id) ON DELETE CASCADE
//     );
//     `;
//       await db.none(createTableTowns);
//       await db.none(createTableRegNumbers);
//       console.log('Table "towns" created successfully.');
      
//       const putTowns = `INSERT INTO towns (town_name) VALUES
//       ('paarl'),
//       ('Bellville'),
//       ('Stellenbosch'),
//       ('Malmesbury'),
//       ('CapeTown'),
//       ('Kuilsriver');
//       `;
  
//       const checkConstraintQuery = `
//         SELECT constraint_name
//         FROM information_schema.table_constraints
//         WHERE table_name = 'registration_numbers' AND constraint_type = 'UNIQUE';
//       `;
//       const existingConstraint = await db.oneOrNone(checkConstraintQuery);
//       await db.oneOrNone(putTowns);
  
//       if (!existingConstraint) {
//         const addUniqueConstraintQuery = `
//           ALTER TABLE registration_numbers ADD CONSTRAINT unique_registration_number UNIQUE (registration_number);
//         `;
//         await db.none(addUniqueConstraintQuery);
//         console.log('Unique constraint added to "registration_number" column.');
//       } else {
//         console.log('Unique constraint already exists.');
//       }
  
//     } catch (error) {
//       console.error('Error creating table:', error.message);
//     }
//   }
//   createUsersTable()
//   async function getTown() {
//     try {
//       // const query = `
//       //   SELECT t.id AS town_id, t.town_name, rn.registration_number
//       //   FROM towns t
//       //   LEFT JOIN registration_numbers rn ON t.id = rn.town_id;
//       // `;
//       const query = `
//         SELECT *
//         FROM towns 
//       `;
//       const townsAndRegistrationNumbers = await db.any(query);
//       console.log(townsAndRegistrationNumbers)
//       return townsAndRegistrationNumbers;
//     } catch (error) {
//       console.error('Error getting towns and registration numbers:', error.message);
//       throw error;
//     }
//   }
  
//   export {
//     getTown
//   };