const { Pool } = require('pg');

const env = process.env;

const pool = new Pool({
    user: 'postgres',
    host: env.DB_HOST,
    password: env.POSTGRES_PASSWORD,
    database: 'flower-shop',
    port: 5432,
});

const queryDatabase = (queryString) => {
    return pool.query(queryString);
}

module.exports = queryDatabase;