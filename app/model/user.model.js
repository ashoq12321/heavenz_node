//const dbconn = require('../config/db.config');
var dbConn = require('../config/db.config');
const crypto = require('crypto');
const commonFunc = require("../common/common_functions.js")
//const assert = require('assert');

var User = function (user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.profile_pic = user.profile_pic;
    this.email = user.email;
    this.password = user.password;
    this.dob = user.dob;
    this.age = user.age;
    this.gender = user.gender;
    this.profession = user.profession;
    this.about_me = user.about_me;
    this.mobile = user.mobile;
    this.email_visibility = user.email_visibility;
    this.mobile_visibility = user.mobile_visibility;
    this.created_at = new Date();
    this.updated_at = new Date();
}


// encrypt password
function encryptPassword(textToEncrypt) {
    let cipher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
    let encrypted = cipher.update(textToEncrypt, 'utf8', 'hex') + cipher.final('hex'); // encrypted text
    return encrypted;
}

// decrypt password
function decryptPassword(textToDecrypt) {
    let decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV);
    let decrypted = decipher.update(textToDecrypt, 'hex', 'utf8') + decipher.final('utf8'); // decrypted text
    return decrypted;
}



// create user
User.createUser = (userReqData, result) => {

    console.log('userReqData ' + userReqData);

    userReqData.password = encryptPassword(userReqData.password)

    userReqData.dob = new Date(userReqData.dob.split(' ')[0])

    userReqData.age = commonFunc.getAge(userReqData.dob)

    dbConn.query('INSERT INTO user SET ?', userReqData, (err, res) => {
        if (err) {
            console.log('error while inserting data');
            //err.message = 'error while inserting data';
            result(err, null);
        } else {
            console.log('User created successfully');
            result(null, res)
        }
    })
}


// find user by email
User.getUserByEmail = (email, result) => {
    dbConn.query('SELECT * FROM user WHERE email=?', email, (err, res) => {
        if (err) {
            console.log('error while fetching user by email', err);
            //err.message = 'error while fetching user by email';
            result(err, null);
        } else {
            if (res.length > 0 && res[0] !== null)
                res[0].password = decryptPassword(res[0].password)
            result(null, res);
        }
    })
}

// find user by id
User.getUserById = (id, result) => {

    dbConn.query('SELECT * FROM user WHERE id=?', id, (err, res) => {
        if (err) {
            console.log('error while fetching user by id', err);
            result(err, null);
        } else {
            if (res.length > 0 && res[0] !== null)
                res[0].password = decryptPassword(res[0].password)
            result(null, res);
        }
    })
}

// find user list by multiple id
User.getUsersListById = (userIds, result) => {
    
    dbConn.query('SELECT * FROM user WHERE id IN (?)', [userIds], (err, res) => {
        if (err) {
            console.log('error while fetching users by multiple ids', err);
            result(err, null);
        } else {
            
            result(null, res);
        }
    })
}

// find users between dobs
User.getUsersByDob = (gender, age_start, age_end, month, start_day, end_day, result) => {

    //console.log("gender : "+JSON.stringify(gender))

    var qry = "";

    if (gender == 'male')
        qry = 'SELECT * FROM user WHERE GENDER = "Male" AGE >= ? AND AGE <= ? AND MONTH(dob) = ? AND (DAY(dob) BETWEEN ? AND ?)';
    else if (gender == 'female')
        qry = 'SELECT * FROM user WHERE GENDER = "Female" AGE >= ? AND AGE <= ? AND MONTH(dob) = ? AND (DAY(dob) BETWEEN ? AND ?)';
    else if (gender == 'both')
        qry = 'SELECT * FROM user WHERE AGE >= ? AND AGE <= ? AND MONTH(dob) = ? AND (DAY(dob) BETWEEN ? AND ?)';

        //console.log("qry : "+JSON.stringify(qry)) 

    dbConn.query(qry, [age_start, age_end, month, start_day, end_day], (err, res) => {
        if (err) {
            console.log('error while fetching users by dob', err);
            result(err, null);
        } else {
            console.log('users fetched by dob', res);
            result(null, res);
        }
    })
}


// find users by limit 
/*User.getUsersByLimitAndOffset = (gender, age_start, age_end, month, start_day, end_day, limit, offset, result) => {

    //console.log("gender : "+JSON.stringify(gender))

    var qry = "";

    if (gender == 'male')
        qry = 'SELECT * FROM user WHERE GENDER = "Male" AGE >= ? AND AGE <= ? AND MONTH(dob) = ? AND (DAY(dob) BETWEEN ? AND ?) LIMIT ? OFFSET ?';
    else if (gender == 'female')
        qry = 'SELECT * FROM user WHERE GENDER = "Female" AGE >= ? AND AGE <= ? AND MONTH(dob) = ? AND (DAY(dob) BETWEEN ? AND ?) LIMIT ? OFFSET ?';
    else if (gender == 'both')
        qry = 'SELECT * FROM user WHERE AGE >= ? AND AGE <= ? AND MONTH(dob) = ? AND (DAY(dob) BETWEEN ? AND ?) LIMIT ? OFFSET ?';

        //console.log("qry : "+JSON.stringify(qry)) 

    dbConn.query(qry, [age_start, age_end, month, start_day, end_day, limit, offset], (err, res) => {
        if (err) {
            console.log('error while fetching users by dob', err);
            result(err, null);
        } else {
            console.log('users fetched by dob', err);
            result(null, res);
        }
    })
}*/


// update user
User.updateUser = (id, userReqData, result) => {
    console.log('userReqData2 ' + JSON.stringify(userReqData));

    userReqData.password = encryptPassword(userReqData.password)

    userReqData.dob = new Date(userReqData.dob.split(' ')[0])

    userReqData.age = commonFunc.getAge(userReqData.dob)

    dbConn.query("UPDATE user SET first_name=?,last_name=?,password=?,dob=?,age=?,gender=?,profession=?,about_me=?,mobile=?,email_visibility=?,mobile_visibility=?,updated_at=? WHERE id = ?",
        [userReqData.first_name, userReqData.last_name, userReqData.password, userReqData.dob, userReqData.age, userReqData.gender, userReqData.profession, userReqData.about_me, userReqData.mobile, userReqData.email_visibility, userReqData.mobile_visibility, userReqData.updated_at, id], (err, res) => {
            if (err) {
                console.log('Error while updating the user');
                result(err, null);
            } else {
                console.log("user updated successfully");
                result(null, res);
            }
        });
}

//update profile picture
User.updateProfilePic = (id, profilePic, result) => {

    dbConn.query("UPDATE user SET profile_pic=? WHERE id = ?",
        [profilePic, id], (err, res) => {
            if (err) {
                console.log('Error while updating profile picture');
                result(err, null);
            } else {
                console.log("profile picture updated successfully");
                result(null, res);
            }
        });
}





module.exports = User;
