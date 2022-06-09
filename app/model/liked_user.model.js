var dbConn = require('../config/db.config');

var LikedUser = function (likedUser) {

    this.liked_user_id = likedUser.liked_user_id;
    this.like_recieved_id = likedUser.like_recieved_id;
    this.category = likedUser.category;
    this.created_at = new Date();
    this.updated_at = new Date();

}

// user liked entry 
LikedUser.likeUser = (reqData, result) => {
    dbConn.query('INSERT INTO liked_user SET ?', reqData, (err, res) => {
        if (err) {
            console.log('error while inserting data');
            result(err, null);
        } else {
            console.log('Liked user entry added successfully');
            result(null, res)
        }
    })
}

// get liked users 
LikedUser.getLikedUsers = (like_recieved_userIds, liked_userId, category, result) => {

    dbConn.query('SELECT * FROM liked_user wHERE like_recieved_id IN (?) AND liked_user_id = ? AND category=?', [like_recieved_userIds, liked_userId, category], (err, res)=>{
        if (err) {
            console.log('Error while fetching liked users', err);
            result(err, null);
        } else {
            //console.log('multiple liked users fetched successfully'+JSON.stringify(res));
            result(null, res);
        }
    });
}


module.exports = LikedUser;
