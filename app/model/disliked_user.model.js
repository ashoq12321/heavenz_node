var dbConn = require('../config/db.config');

var DislikedUser = function (dislikedUser) {

    this.disliked_user_id = dislikedUser.disliked_user_id;
    this.dislike_recieved_id = dislikedUser.dislike_recieved_id;
    this.category = dislikedUser.category;
    this.created_at = new Date();
    this.updated_at = new Date();
}

// user disliked entry 
DislikedUser.dislikeUser = (reqData, result) => {
    dbConn.query('INSERT INTO disliked_user SET ?', reqData, (err, res) => {
        if (err) {
            console.log('error while inserting data');
            result(err, null);
        } else {
            console.log('Disliked user entry added successfully');
            result(null, res)
        }
    })
}

// get disliked users 
DislikedUser.getDisikedUsers = (dislike_recieved_userIds, disliked_userId, category, result) => {

    dbConn.query('SELECT * FROM disliked_user wHERE dislike_recieved_id IN (?) AND disliked_user_id = ? AND category=?', [dislike_recieved_userIds, disliked_userId, category], (err, res)=>{
        if (err) {
            console.log('Error while fetching disliked users', err);
            result(err, null);
        } else {
            //console.log('multiple disliked users fetched successfully'+JSON.stringify(res));
            result(null, res);
        }
    });
}


module.exports = DislikedUser;
