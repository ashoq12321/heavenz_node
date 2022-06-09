require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

//create express app
const app = express();

//setup the server port
const port = process.env.port || 3000;

//import user routes
const userRoutes = require('./app/routes/user.route');

//import setting routes
const userSettingRoutes = require('./app/routes/user_setting.route');

//import image routes
const image = require('./app/routes/image.route');

//import match routes
const matchRoutes = require('./app/routes/matches.route');

//parse request data content type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//parse request data content type application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(getAPIDoc());
})


// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/images', express.static('images'));


// user routes
app.use('/user', userRoutes);

// user settings routes
app.use('/userSetting', userSettingRoutes);

// image routes
app.use('/image', image);

// match routes
app.use('/matches', matchRoutes);






//listen to the port
app.listen(port, () => {
    console.log(`Express Server is running at port ${port}`);
});




function getAPIDoc() {

    var api_doc = ""

    api_doc += "\n\n1. register user" +
        "\nPOST : http://192.168.43.177/user/register" +
        "\n Headers : {" +
        "\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'Accept': 'application/json'," +
        "\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'X-API-KEY': 'c4w2-gba0-bG9s-OnNlY3-VyKU'," +
        "\n }" +
        "\n Request body : {" +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"first_name":"Siva",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"last_name":"Kumar",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"email":"siva@gmail.com",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"password":"33333333",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"dob":"07/31/1992",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"gender":"male",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"email_visibility":"false",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"mobile_visibility":"false"' +
        '\n }'+
        "\n Response body : {" +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"success": true,' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"message": "Account created successfully",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"data": 10' +
        '\n }'

    api_doc += "\n\n1. login user" +
        "\nPOST : http://192.168.43.177/user/login" +
        "\n Headers : {" +
        "\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'Accept': 'application/json'," +
        "\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'X-API-KEY': 'c4w2-gba0-bG9s-OnNlY3-VyKU'," +
        "\n }" +
        "\n Request body : {" +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"first_name":"Siva",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"last_name":"Kumar",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"email":"siva@gmail.com",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"password":"33333333",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"dob":"07/31/1992",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"gender":"male",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"email_visibility":"false",' +
        '\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"mobile_visibility":"false"' +
        '\n }'
        

    return api_doc;
}