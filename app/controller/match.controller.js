const UserModel = require('../model/user.model');
const UserSettingModel = require('../model/user_setting.model');
const MatchModel = require('../model/match.model');
const LikedUser = require('../model/liked_user.model');
const SwipeList = require('../model/swipe_list.model');
const DislikedUser = require('../model/disliked_user.model');
const commonFunc = require("../common/common_functions.js")

// get matches
exports.getMatches = (req, res) => {

    console.log("authenticated_body " + JSON.stringify(req.user));

    //console.log("req params1 : " + JSON.stringify(req.params.category));

    //console.log("req params2 : " + JSON.stringify(req.params.offset));

    //res.status(500).send();

    if (req.params.category === null ||  req.params.category === "" || req.params.offset === null || req.params.offset === "") {
        res.status(400).send({ success: false, message: 'Request params should not be empty' });
    }
    else {

        req.params.offset = parseInt(req.params.offset)

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

                user = user[0];

                //console.log("\n\nreq.body.offsettt : " + JSON.stringify(req.params.offset))

                if (req.params.offset > 0) {

                    SwipeList.getSwipeList(user.id, req.params.category, parseInt(process.env.SWIPE_LIST_LIMIT), req.params.offset, (err, swipeItems1) => {

                        if (err)
                            res.status(500).send();

                        else if (swipeItems1 == null || swipeItems1 != null && swipeItems1.length == 0) {

                            res.status(404).send({
                                success: false,
                                message: "Matches not found"
                            });

                        }

                        else {

                            //console.log("\n\n swipeItems111111 " + JSON.stringify(swipeItems1));

                            var offset = req.params.offset
                            var find_more = true

                            //console.log("\n\n swipeItems1.length " + JSON.stringify(swipeItems1.length));

                            //console.log("\n\n swipeItems1.length " + JSON.stringify(swipeItems1.length));

                            if (swipeItems1 != null && swipeItems1.length == parseInt(process.env.SWIPE_LIST_LIMIT)) {
                                find_more = true;
                                offset = offset + parseInt(process.env.SWIPE_LIST_LIMIT);
                            }
                            else if (swipeItems1 == null || swipeItems1.length < parseInt(process.env.SWIPE_LIST_LIMIT)) {
                                find_more = false;
                            }

                            //console.log("\n\n find_more11111 " + JSON.stringify(find_more));

                            //else {

                            UserModel.getUsersListById(filterMatchingUserIdsFromSwipeItems(swipeItems1), (err, users_list1) => {

                                if (err)
                                    res.status(500).send();

                                else {

                                    console.log("\n\n users_list1111111 " + JSON.stringify(users_list1));

                                    users_list1 = removePasswords(users_list1)

                                    res.json({ success: true, message: 'Matching users fetched successfully', offset: offset, find_more: find_more, data: users_list1 });
                                }
                            })
                            //}

                        }
                    })
                }
                else {

                    SwipeList.deleteSwipeList(user.id, req.params.category, (err, deleted) => {

                        /*if (err)
                            res.status(500).send();*/

                        //else {
                        //delete user[0]['id'];

                        var dob = new Date(user.dob);
                        var month = ("0" + (dob.getMonth() + 1)).slice(-2);
                        var date = ("0" + dob.getDate()).slice(-2);
                        var match_date = date + "/" + month;
                        //console.log("match_date : " + JSON.stringify(match_date))

                        var matches_count = 0;

                        var matches_count2 = 0;

                        var count = -1;

                        MatchModel.getMatches(match_date, req.params.category, (err, matches) => {

                            if (err)
                                res.status(500).send();

                            var swipe_list = [];

                            if (matches == null || matches != null && matches.length == 0) {
                                res.status(404).send({
                                    success: false,
                                    message: "Matches not found"
                                });
                            }

                            //matches_count = matches.length

                            UserSettingModel.getUserSettingsByMultipleUserIdsAndCategory([user.id], req.params.category, (err, settings) => {

                                if (err) {
                                    console.log("error msg : " + err.message)
                                    res.status(500).send();
                                }
                                else if (settings === undefined || settings.length == 0 || settings[0] == null) {
                                    res.status(404).send({
                                        success: false,
                                        message: "Settings not found"

                                    });
                                }
                                else {
                                    //console.log("settings : " + JSON.stringify(matches))

                                    settings = settings[0]

                                    //var count;

                                    matchesloop:
                                    for (var i in matches) {

                                        //console.log("ii : " + JSON.stringify(i))

                                        //console.log("matches : " + JSON.stringify(matches[i].birth_date))

                                        var start_month = matches[i].birth_date.split("-")[0].split("/")[0];
                                        var start_day = matches[i].birth_date.split("-")[0].split("/")[1];
                                        var end_month = matches[i].birth_date.split("-")[1].split("/")[0];
                                        var end_day = matches[i].birth_date.split("-")[1].split("/")[1];

                                        var same_month = true;

                                        for (var c = 0; c < 2; c++) {

                                            var month;

                                            var day_begin;

                                            var day_end;

                                            if (start_month == end_month) {

                                                same_month = true;

                                                month = start_month;
                                                day_begin = start_day;
                                                day_end = end_day;

                                                matches_count++;
                                                matches_count2++;
                                            }
                                            else {

                                                same_month = false;

                                                if (c == 0) {
                                                    month = start_month;
                                                    day_begin = start_day;
                                                    day_end = commonFunc.getEndDay(start_month);

                                                    matches_count++;
                                                    matches_count2++;
                                                }
                                                else if (c == 1) {
                                                    month = end_month;
                                                    day_begin = "01";
                                                    day_end = end_day;

                                                    matches_count++;
                                                    matches_count2++;
                                                }
                                            }

                                            //console.log("month : " + JSON.stringify(month))
                                            //console.log("day_begin : " + JSON.stringify(day_begin))
                                            //console.log("day_end : " + JSON.stringify(day_end))

                                            UserModel.getUsersByDob(settings.gender, settings.age_start, settings.age_end, month, day_begin, day_end, (err, users) => {

                                                if (err)
                                                    res.status(500).send();

                                                else if (users == null || users != null && users.length == 0) {
                                                    matches_count--;
                                                    matches_count2--;

                                                    if (matches_count == 0) {
                                                        res.status(404).send({
                                                            success: false,
                                                            message: "Matches not found"
                                                        });
                                                    }
                                                }

                                                else if (users != null && users.length != 0) {

                                                    var users_array = users // []; users_array = users_array.concat(users)

                                                    //console.log("users_array : " + JSON.stringify(users_array))

                                                    var swipe_list_profiles_ids = [];

                                                    var validating_user_ids_on_settings = []

                                                    for (var k in users_array) {

                                                        validating_user_ids_on_settings.push(users_array[k].id)
                                                        delete users_array[k].password;
                                                    }

                                                    UserSettingModel.getUserSettingsByMultipleUserIdsAndCategory(validating_user_ids_on_settings, req.params.category, (err, settings_list) => {

                                                        for (var m in settings_list) {

                                                            if (settings_list[m].show_profile) {

                                                                if (settings_list[m].gender.toLowerCase() == "both" || settings_list[m].gender.toLowerCase() == user.gender.toLowerCase()) {

                                                                    if (settings_list[m].age_start <= user.age && settings_list[m].age_end >= user.age) {

                                                                        //swipe_list_profiles_ids.push(/*getUserObjectById(users_array,  settings_list[m].user_id)

                                                                        swipe_list_profiles_ids.push(settings_list[m].user_id)
                                                                    }

                                                                }
                                                            }
                                                        }

                                                        var validating_user_ids_on_liked_and_disliked_users = []

                                                        for (var s in swipe_list_profiles_ids) {

                                                            validating_user_ids_on_liked_and_disliked_users.push(swipe_list_profiles_ids[s])
                                                        }

                                                        //console.log("\nswipe_list_profiles_settings_filtered id : " + JSON.stringify(swipe_list_profiles_ids))

                                                        var liked_users_arr = []

                                                        LikedUser.getLikedUsers(validating_user_ids_on_liked_and_disliked_users, user.id, req.params.category, (err, liked_users_list) => {

                                                            //liked_users_arr = liked_users_list

                                                            for (var lik in liked_users_list) {

                                                                liked_users_arr.push(liked_users_list[lik].like_recieved_id)
                                                            }

                                                            //console.log("\nliked_users_arr : " + JSON.stringify(liked_users_arr))

                                                            var disliked_users_arr = []

                                                            DislikedUser.getDisikedUsers(validating_user_ids_on_liked_and_disliked_users, user.id, req.params.category, (err, disliked_users_list) => {

                                                                //disliked_users_arr = disliked_users_list

                                                                for (var dislik in disliked_users_list) {

                                                                    disliked_users_arr.push(disliked_users_list[dislik].dislike_recieved_id)
                                                                }

                                                                //console.log("\ndisliked_users_arr : " + JSON.stringify(disliked_users_arr))


                                                                var liked_and_disked_list = liked_users_arr.concat(disliked_users_arr)

                                                                var namesToDeleteSet = new Set(liked_and_disked_list);

                                                                var newArr = swipe_list_profiles_ids.filter((name) => {

                                                                    return !namesToDeleteSet.has(name);
                                                                });

                                                                swipe_list = swipe_list.concat(newArr);

                                                                count++;

                                                                /*if (matches_count == 0) {
                                                                    res.status(404).send({
                                                                        success: false,
                                                                        message: "Matches not found"
                                                                    });
                                                                }*/
                                                                var swipe_list_updated = [];

                                                                for (var h in swipe_list) {

                                                                    if (swipe_list[h] != user.id) {
                                                                        swipe_list_updated.push(swipe_list[h])
                                                                    }

                                                                }
                                                                swipe_list = swipe_list_updated;

                                                                console.log("\n\n swipe_listttttt : " + JSON.stringify(swipe_list));

                                                                matches_count2--;

                                                                console.log("\n\n matches_count : " + JSON.stringify(matches_count2));


                                                                if ((swipe_list.length > 0) && (count == matches_count - 1 || swipe_list.length >= 500)) {

                                                                    SwipeList.addToSwipeList(getSwipeListReqData(swipe_list, req.params.category, user.id), (err, list) => {

                                                                        if (err)
                                                                            res.status(500).send();

                                                                        else {
                                                                            SwipeList.getSwipeList(user.id, req.params.category, parseInt(process.env.SWIPE_LIST_LIMIT), req.params.offset, (err, swipeItems) => {

                                                                                if (err)
                                                                                    res.status(500).send();

                                                                                var offset = req.params.offset
                                                                                var find_more = true

                                                                                if (swipeItems != null && swipeItems.length == parseInt(process.env.SWIPE_LIST_LIMIT)) {
                                                                                    find_more = true;
                                                                                    offset = offset + parseInt(process.env.SWIPE_LIST_LIMIT);
                                                                                }
                                                                                else if (swipeItems == null || swipeItems.length < parseInt(process.env.SWIPE_LIST_LIMIT)) {
                                                                                    find_more = false;
                                                                                }

                                                                                if (swipeItems != null && swipeItems.length > 0) {

                                                                                    UserModel.getUsersListById(filterMatchingUserIdsFromSwipeItems(swipeItems), (err, users_list2) => {

                                                                                        if (err)
                                                                                            res.status(500).send();
                                                                                        else {

                                                                                            users_list2 = removePasswords(users_list2)

                                                                                            res.json({ success: true, message: 'Matching users fetched successfully', offset: offset, find_more: find_more, data: users_list2 });

                                                                                        }

                                                                                    })
                                                                                }

                                                                                else {
                                                                                    res.status(500).send();
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }

                                                                else {

                                                                    if (matches_count2 == 0 && swipe_list.length == 0) {

                                                                        return res.status(404).send({
                                                                            success: false,
                                                                            message: "Matches not found"
                                                                        });
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    })
                                                }
                                            })

                                            if (same_month) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            })
                        })
                    })
                }
            }
        })
    }
}

function getSwipeListReqData(swipe_list, category, userId) {

    var swipeListRequestData = []

    for (let i = 0; i < swipe_list.length; i++) {

        //if (swipe_list[i] != userId) {

        var data = []

        data.push(category)
        data.push(swipe_list[i])
        data.push(userId)

        swipeListRequestData.push(data);

        // }
    }
    return swipeListRequestData;
}

function filterMatchingUserIdsFromSwipeItems(swipeItems) {

    var userIds = []

    for (let i = 0; i < swipeItems.length; i++) {
        userIds.push(swipeItems[i].matching_user_id)
    }
    return userIds;
}

function removePasswords(users_list) {

    var userIds = []

    for (let i = 0; i < users_list.length; i++) {
        delete users_list[i].password;
    }
    return users_list;
}