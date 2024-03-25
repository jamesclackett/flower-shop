import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'flower-shop',
    port: 5432,
});

const queryDatabase = (queryString) => {
    return pool.query(queryString);
}

export default queryDatabase;