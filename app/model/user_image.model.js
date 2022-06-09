var dbConn = require('../config/db.config');
const fs = require('fs')
//const commonFunc = require("../common/common_functions.js")  

var UserImage = function (userImage) {
    this.file_name = userImage.file_name;
    this.image_index = userImage.image_index;
    this.user_id = userImage.user_id;
}

// save user image details
UserImage.saveImageDetails = (userId, imagesReq, result) => {
    console.log('imagesReq : ' + JSON.stringify(imagesReq));

    if(imagesReq.length == 0){
        result(err, null);
    }

    UserImage.getImageDetails(userId, (err, images) => {

        if (err) {
            console.log('Error while updating the user images');
            result(err, null);
        }
        else {
            console.log("images : " + JSON.stringify(images))

            for (let i = 0; i < images.length; i++) {

                const path = './public/images/' + images[i].file_name

                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return;
                    }
                    console.log("file removed from server folder")
                })
            }

            dbConn.query('DELETE FROM user_image WHERE user_id=?', userId, (err, res) => {

                if (err) {
                    console.log('Error while updating the user images');
                    result(err, null);
                } else {

                    dbConn.query("INSERT INTO user_image (file_name, image_index, user_id, updated_at) VALUES ?", [imagesReq], function (err, res) {
                        if (err) {
                            console.log('error while inserting data');
                            result(err, null);
                        } else {
                            console.log('User image details inserted into db');
                            result(null, res)
                        }
                    })
                }
            });
        }
    })
}

// get user image details
UserImage.getImageDetails = (userId, result) => {
    console.log("userId : " + JSON.stringify(userId))

    dbConn.query('SELECT * FROM user_image WHERE user_id=?', userId, (err, res) => {
        if (err) {
            console.log('Error while fetching user image details', err);
            result(err, null);
        } else {
            console.log('User image details fetched from db');
            console.log("resres : " + JSON.stringify(res))
            result(null, res);
        }
    });
}



module.exports = UserImage;
