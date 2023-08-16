-- Create towns table
CREATE TABLE IF NOT EXISTS towns (
    id serial PRIMARY KEY,
    town_name varchar(255) NOT NULL
);

-- Create registration_numbers table
CREATE TABLE IF NOT EXISTS registration_numbers (
    id serial PRIMARY KEY,
    registration_number varchar(20) NOT NULL,
    town_id int REFERENCES towns(id) ON DELETE CASCADE
);

-- Insert data into towns table
INSERT INTO towns (town_name) VALUES
    ('paarl'),
    ('Bellville'),
    ('Stellenbosch'),
    ('Malmesbury'),
    ('CapeTown'),
    ('Kuilsriver');

-- Add unique constraint to registration_numbers table if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'registration_numbers' AND constraint_type = 'UNIQUE'
    ) THEN
        ALTER TABLE registration_numbers ADD CONSTRAINT unique_registration_number UNIQUE (registration_number);
    END IF;
END $$;

