const UserModel = require('../model/user.model');
const UserSettingModel = require('../model/user_setting.model');
const TokenModel = require('../model/token.model');

const LikedUser = require('../model/liked_user.model');
const DislikedUser = require('../model/disliked_user.model');
const jwt = require('jsonwebtoken');


// create new user
exports.registerUser = (req, res) => {
    req.body.email_visibility = (req.body.email_visibility.toLowerCase() === 'true');
    req.body.mobile_visibility = (req.body.mobile_visibility.toLowerCase() === 'true');

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ success: false, message: 'Please fill all fields' });
    }
    else {
        // check user already signed up or not
        UserModel.getUserByEmail(req.body.email, (err, user) => {
            if (err) {
                res.status(500).send();
            }
            else if (user === undefined || user.length === 0 || user[0] === null) {

                console.log('req data', req.body);
                const userReqData = new UserModel(req.body);
                userReqData.profile_pic = "ic_user.png"
                console.log('userReqData', JSON.stringify(userReqData));

                //create new user 
                UserModel.createUser(userReqData, (err, user2) => {
                    if (err) {
                        console.log("error msg : " + err.message)
                        res.status(500).send();
                    }
                    else {
                        //console.log("\n\nuser2 : " + JSON.stringify(user2))
                        // set initial user settings
                        UserSettingModel.createUserSetting(getInitialUserSettingsData(user2.insertId), (err, userSettingRes) => {
                            if (err) {
                                console.log("error msg : " + err.message)
                                res.status(500).send();
                            }
                        })
                        res.json({ success: true, message: 'Account created successfully', data: user2.insertId });
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Email id already registered"
                });
            }
        })
    }
}

// Authenticate User
exports.login = (req, res) => {
    const email = req.body.email

    //check user registeration
    UserModel.getUserByEmail(email, (err, user) => {
        if (err)
            res.status(500).send();
        else if (user === undefined || user.length == 0 || user[0] === null) {
            res.status(404).send({
                success: false,
                message: "Email not found"

            });
        }
        else {
            if (user[0].password !== req.body.password) {
                res.status(403).send({
                    success: false,
                    message: "Wrong password"
                });
            }
            else {
                user = user[0];

                console.log('user data2', { user });
                const accessToken = generateAccessToken({ user })
                const refreshToken = generateRefreshToken({ user })
                var tokenObj = { token: refreshToken, user_id: user.id }

                console.log('\n\naccessToken', accessToken);

                // check token exists already or not
                TokenModel.getTokenByUserId(user.id, (err, tokenRes) => {
                    if (err)
                        res.status(500).send();

                    else if (tokenRes !== undefined && tokenRes.length !== 0 && tokenRes[0] !== null) {

                        // update existing token
                        console.log(JSON.stringify(tokenRes[0]))
                        TokenModel.updateToken(tokenRes[0].id, tokenObj, (err, token) => {
                            if (err)
                                res.status(500).send();
                        })
                    }
                    else {
                        // add refresh token key into db
                        TokenModel.addToken(tokenObj, (err, token) => {
                            if (err)
                                res.status(500).send();
                        })
                    }
                    res.json({ success: true, accessToken: accessToken, refreshToken: refreshToken })
                })
            }
        }
    })
}


// check token validity and set current user object into request     //middleware fun
exports.authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    console.log("authHeader " + authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({ // Worked
        success: false,
        message: "Unauthorised user",
    });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json({ // Worked
            success: false,
            message: "Unauthorised user",
        });
        else
            console.log("user.id : " + JSON.stringify(user))
        if (user.user.user != undefined) {
            console.log("\sssss")
            req.user = user.user.user;
        } else {
            console.log("\nbbbbbbbbb")
            req.user = user.user;
        }
        next();
    })

    //var authenticated_body;
    /*try {
        req.authenticated_body = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("userrrr " + JSON.stringify(req.authenticated_body.user));
        next()

    } catch (e) {
        res.sendStatus(401);
    }*/
    //req.authenticated_body = authenticated_body
    //console.log("userrrr " + JSON.stringify(req.authenticated_body.user));

}

// get new access token using refresh
exports.token = (req, res) => {

    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userRes) => {

        if (err) return res.sendStatus(403)
        else {
            var user = userRes.user
            const accessToken = generateAccessToken({ user })

            res.json({ success: true, accessToken: accessToken })
        }
    })
}

// logout
exports.logout = (req, res) => {
    console.log("authenticated_bodyy " + JSON.stringify(req.user));

    ///deleting refresh token
    TokenModel.deleteTokenByUserId(req.user.id, (err, token) => {
        if (err)
            res.status(500).send();
        res.json({ success: true, message: 'Logged out' });
    })
}

// update user details
exports.updateUser = (req, res) => {
    req.body.email_visibility = (req.body.email_visibility.toLowerCase() === 'true');
    req.body.mobile_visibility = (req.body.mobile_visibility.toLowerCase() === 'true');

    console.log('req data', req.body);

    console.log("authenticated_body " + JSON.stringify(req.user));

    const userReqData = new UserModel(req.body);

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ success: false, message: 'Please fill all fields' });
    }
    else {
        console.log('updateUser ');
        UserModel.updateUser(req.user.id, userReqData, (err, result) => {
            if (err) {
                res.status(500).send();
            } else {
                if (req.body.password === req.user.password) {
                    res.json({ success: true, tokenUpdated: false })
                } else {
                    user = req.body;
                    user.email = req.user.email;
                    user.id = req.user.id;

                    console.log('user data2', { user });
                    const accessToken = generateAccessToken({ user })
                    const refreshToken = generateRefreshToken({ user })
                    var tokenObj = { token: refreshToken, user_id: user.id }

                    // check token exists already or not
                    TokenModel.getTokenByUserId(user.id, (err, tokenRes) => {
                        if (err)
                            res.status(500).send();

                        else if (tokenRes !== undefined && tokenRes.length !== 0 && tokenRes[0] !== null) {
                            // update existing token
                            console.log(JSON.stringify(tokenRes[0]))
                            TokenModel.updateToken(tokenRes[0].id, tokenObj, (err, token) => {
                                if (err)
                                    res.status(500).send();
                            })
                        }
                        else {
                            // add refresh token key into db
                            TokenModel.addToken(tokenObj, (err, token) => {
                                if (err)
                                    res.status(500).send();
                            })
                        }
                        res.json({ success: true, tokenUpdated: true, accessToken: accessToken, refreshToken: refreshToken })
                    })
                }
            }
        })
    }
}

// fetch user details
exports.getUserDetails = (req, res) => {
    console.log("authenticated_body " + JSON.stringify(req.user));
    UserModel.getUserById(req.user.id, (err, user) => {
        if (err)
            res.status(500).send();
        else if (user === undefined || user.length == 0 || user[0] === null) {
            res.status(404).send({
                success: false,
                message: "User not found"

            });
        }
        else {
            //delete user[0]['id'];
            user[0].email_visibility = user[0].email_visibility ? "true" : "false"
            user[0].mobile_visibility = user[0].mobile_visibility ? "true" : "false"
            res.json({ success: true, message: 'user details fetched successfully', data: user[0] });
        }

    })
}

// fetch user's basic details
exports.getUserBasicDetails = (req, res) => {
    console.log("authenticated_body " + JSON.stringify(req.user));
    UserModel.getUserById(req.user.id, (err, user) => {
        if (err)
            res.status(500).send();
        else if (user === undefined || user.length == 0 || user[0] === null) {
            res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        else {
            var data = {
                "first_name": user[0].first_name ,
                "last_name": user[0].last_name,
                "profile_pic_url": process.env.IMAGE_ACCESS_URL_PREFIX + user[0].profile_pic,
                "profile_percentage": 75
            }
            res.json({ success: true, message: 'user details fetched successfully', data: data });
        }

    })
}

// get user by id
exports.getUserById = (req, res) => {

    UserModel.getUserById(req.params.user_id, (err, user) => {
        if (err)
            res.status(500).send();
        else if (user === undefined || user.length == 0 || user[0] === null) {
            res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        else {
            delete user[0]['password'];
            // user[0].email_visibility = user[0].email_visibility ? "true" : "false"
            // user[0].mobile_visibility = user[0].mobile_visibility ? "true" : "false"
            res.json({ success: true, message: 'user details fetched successfully', data: user[0] });
        }
    })
}

//like user
exports.likeUser = (req, res) => {

    UserModel.getUserById(req.body.user_id, (err, user) => {
        if (err) {
            res.status(500).send();
        }

        var body = {
            "liked_user_id": req.user.id,
            "like_recieved_id": user[0].id,
            "category": req.body.category
        }
        const reqData = new LikedUser(body);

        //create new liked user entry 
        LikedUser.likeUser(reqData, (err, result) => {
            if (err) {
                console.log("error msg : " + err.message)
                res.status(500).send();
            }
            else {
                /*LikedUser.getLikedUsers([req.user.id], user[0].id, req.body.category, (err, result2) => {
                    if (result2 != null && result2.length > 0 && result2[0] != null) {
                        res.json({ success: true, match: true, message: 'user like added and match found', data: result });
                    } 
                    else {
                        res.json({ success: true, match: false, message: 'user like added', data: result });
                    }
                })*/
                res.json({ success: true, match: false, message: 'user like added', data: result });
            }
        })
    })
}

//dislike user
exports.dislikeUser = (req, res) => {

    UserModel.getUserById(req.body.user_id, (err, user) => {

        if (err) {
            res.status(500).send();
        }

        var body = {
            "disliked_user_id": req.user.id,
            "dislike_recieved_id": user[0].id,
            "category": req.body.category
        }
        const reqData = new DislikedUser(body);

        //create new liked user entry 
        DislikedUser.dislikeUser(reqData, (err, result) => {
            if (err) {
                console.log("error msg : " + err.message)
                res.status(500).send();
            }
            else {
                res.json({ success: true, message: 'user dislike added', data: result });
            }
        })
    })
}


// create access token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS })
}

// create access token
function generateRefreshToken(user) {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET)
}

// inital user settings input data
function getInitialUserSettingsData(userId) {
    var userSettingsRequestData = []
    var categories = ["ROOM MATE", "WORK", "LOVE", "MARRIAGE", "FRIEND"]

    for (let i = 0; i < categories.length; i++) {
        /*var data = {
            category_name: categories[i],
            gender: "male",
            age_start: 18,
            age_end: 90,
            distance: 100,
            show_profile: true,
            online_visibility: true,
            last_seen: true
        }*/
        var data = []
        data.push(categories[i])
        data.push("both")
        data.push(18)
        data.push(90)
        data.push(100)
        data.push(true)
        data.push(true)
        data.push(true)
        data.push(userId)
        //data.push(new Date())
        data.push(new Date())

        userSettingsRequestData.push(data);
    }
    return userSettingsRequestData;
}

