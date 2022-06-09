const UserImageModel = require('../model/user_image.model');
const UserModel = require('../model/user.model');
const commonFunc = require("../common/common_functions.js")

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files')
    },
    filename: function (req, file, cb) {
        var mimeExtension = null;

        if (req.body.video_available == "true") {
            mimeExtension = {
                'application/octet-stream': '.mp4'
            }
            req.body.video_available = "video_available"

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            cb(null, "video" + '-' + uniqueSuffix + mimeExtension[file.mimetype])
        }
        else {
            mimeExtension = {
                'image/jpeg': '.jpeg',
                'image/jpg': '.jpg',
                'image/png': '.png',
                'application/octet-stream': '.png'
            }

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            cb(null, "image" + '-' + uniqueSuffix + mimeExtension[file.mimetype])
        }

    }
})

exports.uploadImages = multer({

    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log("file mimetype : " + JSON.stringify(file.mimetype))

        if (file.mimetype === "application/octet-stream" || file.mimetype ==="image/png" || file.mimetype ==="image/jpeg" || file.mimetype ==="image/jpg") {

            cb(null, true,);
        }
        /*else if (file.mimetype === "video/mp4" && fileSize <= 22282810) {
            cb(null, true)
        } */
        else {
            cb(null, false);

            req.fileError = 'File format is not valid';
        }
    }
})

// save user images
exports.saveUserImages = (req, res) => {

    console.log("authenticated_body " + JSON.stringify(req.user));

    if (req.fileError) {
        res.status(400).send({ success: false, message: req.fileError });
    }
    else {
        console.log('no error ');
        console.log('req data', JSON.stringify(req.body));
        //res.status(200).send();
    }
    console.log("req.files len : " + JSON.stringify(req.files.length))

    var filenames = req.files.map(function (file) {
        console.log("file.filename  : " + JSON.stringify(file.filename))
        return file.filename;   // or file.originalname
    });

    UserImageModel.saveImageDetails(req.user.id, getUserImagesRequestData(req.user.id, filenames), (err, result) => {
        if (err) {
            console.log("error msg : " + err.message)
            res.status(500).send();
        }

        var profilePicFileName;

        if (req.body.video_available === "video_available")
            profilePicFileName = filenames[1];
        else
            profilePicFileName = filenames[0];

        UserModel.updateProfilePic(req.user.id, profilePicFileName, (err, result) => {
            if (err) {
                console.log("error msg : " + err.message)
                res.status(500).send();
            }
        })
        /*let resultHandler = function (err) {
            if (err) {
                console.log("unlink failed", err);
            } else {
                console.log("file deleted");
            }
        }
        fs.unlink(req.file.path, resultHandler);*/

        res.json({ success: true, message: 'User images saved successfully', data: result });
    })
}

// get user images
exports.getUserImages = (req, res) => {

    console.log("authenticated_body " + JSON.stringify(req.user));

    UserImageModel.getImageDetails(req.user.id, (err, images) => {

        if (err) {
            console.log("error msg : " + err.message)
            res.status(500).send();
        }
        else {
            console.log("result.data : " + JSON.stringify(images))
            images = commonFunc.getUrlAddedImages(images)//UserImageModel.getUrlAddedImages(images)

            console.log("result : " + JSON.stringify(images))
            res.json({ success: true, message: 'User images fetched successfully', data: images });
        }
    })
}


// get user images by user id
exports.getUserImagesById = (req, res) => {

    console.log("authenticated_body " + JSON.stringify(req.user));

    UserImageModel.getImageDetails(req.params.user_id, (err, images) => {

        if (err) {
            console.log("error msg : " + err.message)
            res.status(500).send();
        }
        else {
            console.log("result.data : " + JSON.stringify(images))
            images = commonFunc.getUrlAddedImages(images)//UserImageModel.getUrlAddedImages(images)

            console.log("result : " + JSON.stringify(images))
            res.json({ success: true, message: 'User images fetched successfully', data: images });
        }
    })
}




// generate user images data
function getUserImagesRequestData(userId, filenames) {

    var userImagesRequestData = []

    for (let i = 0; i < filenames.length; i++) {

        var data = []

        data.push(filenames[i])
        data.push(i)
        data.push(userId)
        data.push(new Date())

        userImagesRequestData.push(data);

    }
    return userImagesRequestData;
}



