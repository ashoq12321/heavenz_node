const UserSettingModel = require('../model/user_setting.model');
//const jwt = require('jsonwebtoken');


// update user setting
exports.updateUserSetting = (req, res) => {

    console.log("authenticated_body " + JSON.stringify(req.user));

    //var json =JSON.parse(req.body.data) 

    //console.log('req data',  JSON.stringify(req.body));

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ success: false, message: 'Fields should not be empty' });
    }
    else {
        console.log('updateUserSettings');
        UserSettingModel.updateUserSetting(req.user.id, getUserSettingsRequestData(req.user.id, req.body), (err, result) => {
            if (err) {
                console.log("error msg : " + err.message)
                res.status(500).send();
            }
            res.json({ success: true, message: 'User settings updated successfully', data: result.insertId });
        })
    }
}

// get user settings
exports.getUserSettings = (req, res) => {

    console.log("authenticated_body " + JSON.stringify(req.user));

    UserSettingModel.getUserSettings(req.user.id, (err, result) => {

        if (err) {
            console.log("error msg : " + err.message)
            res.status(500).send();
        }
        else if (result === undefined || result.length == 0 || result[0] === null) {
            res.status(404).send({
                success: false,
                message: "Settings not found"

            });
        }
        else{
            console.log("result : "+JSON.stringify(result))
            res.json({ success: true, message: 'User settings fetched successfully', data: result });
        }
            
    })
}


// inital user settings input data
function getUserSettingsRequestData(userId, requestDataList) {

    var userSettingsRequestData = []

    for (let i = 0; i < requestDataList.length; i++) {
        var data = []
        data.push(requestDataList[i].category_name)
        data.push(requestDataList[i].gender.toLowerCase())
        data.push(parseInt(requestDataList[i].age_start))
        data.push(parseInt(requestDataList[i].age_end))
        data.push(parseInt(requestDataList[i].distance))
        data.push(requestDataList[i].show_profile.toLowerCase() === 'true')
        data.push(requestDataList[i].online_visibility.toLowerCase() === 'true')
        data.push(requestDataList[i].last_seen.toLowerCase() === 'true')
        data.push(userId)
        data.push(new Date())

        userSettingsRequestData.push(data);
    }
    return userSettingsRequestData;
}


