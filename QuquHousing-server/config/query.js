const mysql = require('mysql2')
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'payadmin',
    port: parseInt(process.env.DB_PORT) || 3306,
    password: process.env.DB_PASSWORD || 'mfe2013',
    database: process.env.DB_NAME || 'userdb',
})

// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

let query = function( sql, values ) {
  // 返回一个 Promise
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err );
        console.log("建立连接失败");
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err );
          } else {
            resolve( rows );
          }
          // 结束会话
          connection.release();
        });
      }
    })
  })
}

module.exports =  query