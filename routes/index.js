var express = require('express');
var app = express();
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
});
//
// router.post('/',function (req, res) {
//     console.log("Got a POST request for the homepage");
//     res.send('Hello POST');
// });
// router.use(express.static('publico'));
// router.delete('/delete',function (req, res) {
//     console.log('hahaha');
//     res.send('Hello Delete');
// });

router.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" );
});


module.exports = router;
