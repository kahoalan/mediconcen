var mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    user: 'admin',
    password: 'test1234',
    database: 'news',
});
/**
 *
 * @param sql SQL (string)
 * @param args arguments (null/string/array)
 */
function query(sql, args) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = query;
