const mysql = require('mysql');

const dbconn = mysql.createConnection({

    host: "174.138.34.183", // //'localhost',
    //path: '/phpmyadmin',
    user: "heavnzdb_user", 
    password: "cVHs%P&6*gvcWsn", 
    database: "heavnz_db", 
    port: 3306

    /*host: 'localhost',//192.168.43.177
    user: 'heavenzuser2',
    password: '92+FUYA25@bupw2!',
    database: 'heavenz_database',
    //port: 3306*/
});

dbconn.connect(function (error) {
    if (error) {
        console.log("Database Connectivity Error : " + JSON.stringify(error))
        throw error;
    }
    console.log('Database Connected Successfully!!!');
});

module.exports = dbconn;