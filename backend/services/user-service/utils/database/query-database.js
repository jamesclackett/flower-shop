const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'flower-shop',
    port: 5432,
});

const queryDatabase = (queryString) => {
    return pool.query(queryString);
}

module.exports = queryDatabase;