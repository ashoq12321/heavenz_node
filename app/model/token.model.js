//const dbconn = require('../config/db.config');
var dbConn = require('../config/db.config');

var RefreshToken = function (refreshToken) {
    this.token = refreshToken.token;
    this.user_id = refreshToken.user_id;
}


// add token
RefreshToken.addToken = (tokenReqData, result) => {
    dbConn.query('INSERT INTO refresh_token SET ?', tokenReqData, (err, res)=>{
        if(err){
            console.log('error while inserting data');
            result(err, null);
        } else {
            console.log('token added to db successfully');
            result(null, res)
        }
    })
}

// find token by user id
RefreshToken.getTokenByUserId = (userId, result)=> {
    dbConn.query('SELECT * FROM refresh_token WHERE user_id=?', userId, (err, res)=>{
        if(err){
            console.log('error while fetching user by id', err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

//update token
RefreshToken.updateToken = (id, tokenReqData, result) => {
    dbConn.query("UPDATE refresh_token SET token=?,user_id=? WHERE id = ?",
     [tokenReqData.token, tokenReqData.user_id, id], (err, res)=>{
        if(err){
            console.log('Error while updating the token');
            result(err, null);
        }else{
            console.log("Token updated successfully");
            result(null, res);
        }
    });
}

//delete token
RefreshToken.deleteTokenByUserId = (userId, result) => {

    console.log("user id : "+userId)

    /// force delete
    dbConn.query('DELETE FROM refresh_token WHERE user_id=?', userId, (err, res) => {
        if(err) {
            console.log('error while deleting token');
            result(err, null);
        } else {
            console.log("token deleted successfully");
            result(null, res);
        }
    })

}

module.exports = RefreshToken;
