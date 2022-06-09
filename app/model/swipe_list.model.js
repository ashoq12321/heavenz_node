var dbConn = require('../config/db.config');

var SwipeList = function (swipeList) {

    this.category = swipeList.category;
    this.matching_user_id = swipeList.matching_user_id;
    this.user_id = swipeList.user_id;
}

// add to swipe list 
SwipeList.addToSwipeList = (reqData, result) => {

    dbConn.query('INSERT INTO swipe_list (category, matching_user_id, user_id) VALUES ?', [reqData], (err, res) => {
        if (err) {
            console.log('error while inserting data');
            result(err, null);
        } else {
            console.log('SwipeList added successfully');
            result(null, res)
        }
    })

}

// get swipe list by category and user id
SwipeList.getSwipeList = (userId, category, limit, offset, result) => {
    
    dbConn.query('SELECT * FROM swipe_list WHERE user_id=? AND category=? LIMIT ? OFFSET ?', [userId, category, limit, offset], (err, res) => {
        if (err) {
            console.log('error while fetching swipe_list', err);
            result(err, null);
        } 
        else {
            console.log('SwipeList fetched successfully');
            result(null, res);
        }
    })
}

// delete old swipe list 
SwipeList.deleteSwipeList = (userId, category, result) => {

    dbConn.query('DELETE FROM swipe_list WHERE user_id=? AND category=?', [userId, category], (err, res) => {

        if (err) {
            console.log('error while deleting data');
            result(err, null);
        } else {
            console.log('SwipeList deleted successfully');
            result(null, res)
        }

    })
    
}

// get liked users 
/*LikedUser.getLikedUsers = (like_recieved_userIds, liked_userId, result) => {

    dbConn.query('SELECT * FROM liked_user wHERE like_recieved_id IN (?) AND liked_user_id = ?', [like_recieved_userIds, liked_userId], (err, res)=>{
        if (err) {
            console.log('Error while fetching liked users', err);
            result(err, null);
        } else {
            //console.log('multiple liked users fetched successfully'+JSON.stringify(res));
            result(null, res);
        }
    });
}*/


module.exports = SwipeList;
