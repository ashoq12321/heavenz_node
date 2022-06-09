var dbConn = require('../config/db.config');

var UserSetting = function (user_setting) {
    this.category_name = user_setting.category_name;
    this.gender = user_setting.gender;
    this.age_start = user_setting.age_start;
    this.age_end = user_setting.age_end;
    this.distance = user_setting.distance;
    this.show_profile = user_setting.show_profile;
    this.online_visibility = user_setting.online_visibility;
    this.last_seen = user_setting.last_seen;
    //this.created_at = new Date();
    this.updated_at = new Date();
}

// add user setting
UserSetting.createUserSetting = (userSettingReqData, result) => {

    console.log('userSettingReqData ' + userSettingReqData);

    dbConn.query("INSERT INTO user_setting (category_name, gender, age_start, age_end, distance, show_profile, online_visibility, last_seen, user_id, updated_at) VALUES ?", [userSettingReqData], function (err, res) {
        if (err) {
            console.log('error while inserting data');
            result(err, null);
        } else {
            console.log('User settings added successfully');
            result(null, res)
        }
    })
}

// update user setting
UserSetting.updateUserSetting = (userId, userSettingReqData, result) => {
    console.log('userReqData2 ' + JSON.stringify(userSettingReqData));

    dbConn.query('DELETE FROM user_setting WHERE user_id=?', userId, (err, res) => {
        if (err) {
            console.log('Error while updating the user settings');
            result(err, null);
        } else {
            dbConn.query("INSERT INTO user_setting (category_name, gender, age_start, age_end, distance, show_profile, online_visibility, last_seen, user_id, updated_at) VALUES ?", [userSettingReqData], function (err, res) {
                if (err) {
                    console.log('Error while updating the user settings');
                    result(err, null);
                } else {
                    console.log('User settings inserted into db');
                    result(null, res)
                }
            })
        }
    });
}

// get user settings
UserSetting.getUserSettings = (userId, result) => {

    console.log('userId in model : '+JSON.stringify(userId));

    dbConn.query('SELECT * FROM user_setting wHERE user_id=?', userId, (err, res)=>{
        if (err) {
            console.log('Error while fetching user settings', err);
            result(err, null);
        } else {
            console.log('User settings fetched successfully');
            result(null, res);
        }
    });
}

// get user settings by multiple user ids
 UserSetting.getUserSettingsByMultipleUserIdsAndCategory = (userIds, category, result) => {

    if(category == "FLING") category = "LOVE"
    else if(category == "FAMILY") category = "ROOM MATE"

    console.log('userIds in model : '+JSON.stringify(userIds));
    console.log('category : '+JSON.stringify(category));

    dbConn.query('SELECT * FROM user_setting wHERE user_id IN (?) AND category_name=?', [userIds, category], (err, res)=>{
        if (err) {
            console.log('Error while fetching user settings', err);
            result(err, null);
        } else {
            console.log('multiple user settings fetched successfully'+JSON.stringify(res));
            result(null, res);
        }
    });
}

module.exports = UserSetting;
