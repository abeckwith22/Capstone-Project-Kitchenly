\echo 'Delete and recreate kitchenly db?'
\prompt 'Return for yes or control-C to cancel > ' foo

-- Drop the existing kitchenly database if it exists
DROP DATABASE IF EXISTS kitchenly;

-- Create new kitchenly database
CREATE DATABASE kitchenly;

-- Connect to the kitchenly database
\connect kitchenly

-- Execute the schema and seed SQL scripts
\i kitchenly-schema.sql
\i kitchenly-seed.sql

\echo 'Delete and recreate kitchenly_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

-- Drop the existing kitchenly_test database if it exists
DROP DATABASE IF EXISTS kitchenly_test;

-- Create the new kitchenly_test database
CREATE DATABASE kitchenly_test;

-- Connect to the kitchenly_test database
\connect kitchenly_test;

-- Execute the schema SQL script
\i kitchenly-schema.sql
