var dbConn = require('../config/db.config');

var Match = function (match) {

    this.birth_date = match.birth_date;
    this.category = match.category;
    this.match_date = match.match_date;
    this.added_datetime = new Date();

}

// get matched user profiles based on category
Match.getMatches = (match_date, category, result) => {
    //console.log("parseInt(process.env.SWIPE_LIST_LIMIT) : "+JSON.stringify(parseInt(process.env.SWIPE_LIST_LIMIT)))

    dbConn.query('SELECT birth_date FROM a_birthdate_details WHERE match_date=? AND category=?' , [ match_date, category], (err, res)=>{
        if (err) {
            console.log('Error while fetching matches', err);
            result(err, null);
        } else {
            console.log('Matches fetched successfully');
            result(null, res);
        }
    });
}

module.exports = Match;
