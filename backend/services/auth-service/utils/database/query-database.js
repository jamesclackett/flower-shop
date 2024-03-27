const { Pool } = require('pg');

const env = process.env;

const pool = new Pool({
    user: 'postgres',
    password: env.POSTGRES_PASSWORD,
    host: env.DB_HOST,
    database: 'flower-shop',
    port: 5432,
});

const queryDatabase =  async (queryString) => {
    let result;
    try {
        result = await pool.query(queryString);
    } catch (error) {
        console.log("Error executing query in DB", error);
    }
    return result;
}

module.exports = queryDatabase;