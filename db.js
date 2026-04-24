const sql = require('mssql');

const config = {
    server: 'DESKTOP-MP5HKF9',
    user: 'testuser',
    password: '12345',
    database: 'CampusNexus',
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to DB');
        return pool;
    })
    .catch(err => console.log('DB ERROR:', err));

module.exports = { sql, poolPromise };