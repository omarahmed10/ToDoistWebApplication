var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');
var app = express();
var routes = require('./routes/index');
var jsdom = require("jsdom");
var session = require('express-session');
app.use(session({secret: 'ssshhhhh'}));
// app.use(express.session({secret: '1234567890QWERTY'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.get('/', routes);

// app.use('/users', users);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public/ToDoist'));
app.post('/signUp', urlencodedParser, function (req, res) {
    var response = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        authenticated: true
    };
    // req.session.email = response.email ;
    // //console.log(response.email);
    // console.log(req.session.email);
    var data = fs.readFileSync("./public/ToDoist/users.json", 'utf8');
    data = JSON.parse(data);
    // searching for user with same data
    var found = false;
    var wrongPass = false;
    var password = response.password;
    if (password.toString().trim().length < 5) {
        var data = fs.readFileSync("./public/ToDoist/signup/signup.html");
        jsdom.env("./public/ToDoist/signup/signup.html", function (err, window) {
            var $ = require('jquery')(window);
            $("p").each(function () {
                $(this).css("padding-left", "0%");
                $(this).text("Password must be at least 5 characters");
                $(this).css("background-color", "#ffff66");
            });
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(window.document.documentElement.outerHTML);
            res.end();
        });
    }
    else {
        data.forEach(function (item) {
            if (response.email == item.email) {
                found = true;
            }
        });
        if (!found) {
            // initializing all data of the  new user
            var tasks = [];
            data.push(response);
            // console.log(data);
            var aTask = fs.readFileSync("./public/ToDoist/UsersAllTasks.json", 'utf8');
            aTask = JSON.parse(aTask);
            aTask.push(tasks);
            var pTask = fs.readFileSync("./public/ToDoist/UsersProgressTasks.json", 'utf8');
            pTask = JSON.parse(pTask);
            pTask.push(tasks);
            var cTask = fs.readFileSync("./public/ToDoist/UsersCompletedTasks.json", 'utf8');
            cTask = JSON.parse(cTask);
            cTask.push(tasks);
            var arTask = fs.readFileSync("./public/ToDoist/UsersArchivedTasks.json", 'utf8');
            arTask = JSON.parse(arTask);
            arTask.push(tasks);
            fs.writeFileSync("./public/ToDoist/UsersAllTasks.json", JSON.stringify(aTask));
            fs.writeFileSync("./public/ToDoist/UsersProgressTasks.json", JSON.stringify(pTask));
            fs.writeFileSync("./public/ToDoist/UsersCompletedTasks.json", JSON.stringify(cTask));
            fs.writeFileSync("./public/ToDoist/UsersArchivedTasks.json", JSON.stringify(arTask));
            fs.writeFileSync("./public/ToDoist/users.json", JSON.stringify(data));
            fs.readFile("./public/ToDoist/index.html", function (err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }
        else {
            var data = fs.readFileSync("./public/ToDoist/signup/signup.html");
            jsdom.env("./public/ToDoist/signup/signup.html", function (err, window) {
                var $ = require('jquery')(window);
                $("p").each(function () {
                    $(this).css("padding-left", "0%");
                    $(this).text("this email is used before please choose another one");
                    $(this).css("background-color", "#ffff66");
                });
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(window.document.documentElement.outerHTML);
                res.end();
            });
        }
    }
});
app.post('/signIn', urlencodedParser, function (req, res) {
    var response = {
        email: req.body.email,
        password: req.body.password
    };
    // console.log(req.session.email);
    // req.session.email = response.email ;
    // console.log(req.session.email);
    var data = fs.readFileSync("./public/ToDoist/users.json", 'utf8');
    data = JSON.parse(data);
    var user;
    found = false;
    var index_authenticatedUser = 0;
    data.forEach(function (item) {
        if (response.email == item.email && response.password == item.password) {
            user = item;
            data[index_authenticatedUser].authenticated = true;
            fs.writeFileSync("./public/ToDoist/users.json", JSON.stringify(data));
            fs.readFile("./public/ToDoist/index.html", function (err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
            found = true;
        }
        if (!found) {
            index_authenticatedUser++;
        }
    });
    if (!found) {
        var data = fs.readFileSync("./public/ToDoist/signin/signin.html");
        jsdom.env("./public/ToDoist/signin/signin.html", function (err, window) {
            var $ = require('jquery')(window);
            $("p").each(function () {
                text = "<a href='../signup/signup.html' style='cursor : pointer'>create a new account</a>"
                $(this).css("padding-left", "0%");
                $(this).text("Wrong user name or password please try again or ");
                $(this).append(text);
                $(this).css("background-color", "#ffff66");
            });
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(window.document.documentElement.outerHTML);
            res.end();
        });
    }
});
app.post('/check', urlencodedParser, function (req, res) {
    var data = fs.readFileSync("./public/ToDoist/users.json", 'utf8');
    data = JSON.parse(data);
    found = false;
    data.forEach(function (item) {
        if (item.authenticated == true) {
            fs.readFile("./public/ToDoist/index.html", function (err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
            found = true;
        }
    });
    if (!found) {
        var data = fs.readFileSync("./public/ToDoist/signin/signin.html");
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
});
app.post('/signOut', urlencodedParser, function (req, res) {
    var data = fs.readFileSync("./public/ToDoist/users.json", 'utf8');
    data = JSON.parse(data);
    data.forEach(function (item) {
        if (item.authenticated == true) {
            item.authenticated = false;
        }
    });
    fs.writeFileSync("./public/ToDoist/users.json", JSON.stringify(data));
    fs.readFile("./public/ToDoist/cover/cover.html", function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});
app.post('/deleteUser', urlencodedParser, function (req, res) {
    var users = fs.readFileSync("./public/ToDoist/users.json", 'utf8');
    users = JSON.parse(users);
    var index = 0;
    users.forEach(function (item) {
        if (item.authenticated == true) {
            users.splice(index, 1);
            fs.writeFileSync("./public/ToDoist/users.json", JSON.stringify(users));
            var tasks = fs.readFileSync("./public/ToDoist/UsersAllTasks.json");
            tasks = JSON.parse(tasks);
            tasks.splice(index, 1);
            fs.writeFileSync("./public/ToDoist/UsersAllTasks.json", JSON.stringify(tasks));
            ////////////
            var ctasks = fs.readFileSync("./public/ToDoist/UsersCompletedTasks.json");
            ctasks = JSON.parse(ctasks);
            ctasks.splice(index, 1);
            fs.writeFileSync("./public/ToDoist/UsersCompletedTasks.json", JSON.stringify(ctasks));
            ///////////
            var artasks = fs.readFileSync("./public/ToDoist/UsersArchivedTasks.json");
            artasks = JSON.parse(artasks);
            artasks.splice(index, 1);
            fs.writeFileSync("./public/ToDoist/UsersArchivedTasks.json", JSON.stringify(artasks));
            ////////////
            var ptasks = fs.readFileSync("./public/ToDoist/UsersProgressTasks.json");
            ptasks = JSON.parse(ptasks);
            ptasks.splice(index, 1);
            fs.writeFileSync("./public/ToDoist/UsersProgressTasks.json", JSON.stringify(ptasks));
        }
        index++;
    });
    fs.readFile("./public/ToDoist/cover/cover.html", function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});
// var url = require('url');
// var querystring = require('querystring');
app.post('/save', urlencodedParser, function (req, res) {
    var oldUserTasks = fs.readFileSync("./public/ToDoist/UsersAllTasks.json", 'utf8');
    oldUserTasks = JSON.parse(oldUserTasks);
    oldUserTasks[req.body.curr] = JSON.parse(req.body.allt);
    // //console.log(oldUserTasks)
    fs.writeFileSync("./public/ToDoist/UsersAllTasks.json", JSON.stringify(oldUserTasks));
    /* usersArchivedTasks */
    var oldUserTasks1 = fs.readFileSync("./public/ToDoist/UsersArchivedTasks.json", 'utf8');
    oldUserTasks1 = JSON.parse(oldUserTasks1);
    oldUserTasks1[req.body.curr] = JSON.parse(req.body.art);
    // //console.log(oldUserTasks)
    fs.writeFileSync("./public/ToDoist/UsersArchivedTasks.json", JSON.stringify(oldUserTasks1));
    /* userCompletedTasks */
    var oldUserTasks2 = fs.readFileSync("./public/ToDoist/UsersCompletedTasks.json", 'utf8');
    oldUserTasks2 = JSON.parse(oldUserTasks2);
    oldUserTasks2[req.body.curr] = JSON.parse(req.body.comt);
    // //console.log(oldUserTasks)
    fs.writeFileSync("./public/ToDoist/UsersCompletedTasks.json", JSON.stringify(oldUserTasks2));
    /* userProgressTasks */
    var oldUserTasks = fs.readFileSync("./public/ToDoist/UsersProgressTasks.json", 'utf8');
    oldUserTasks = JSON.parse(oldUserTasks);
    oldUserTasks[req.body.curr] = JSON.parse(req.body.prot);
    // //console.log(oldUserTasks)
    fs.writeFileSync("./public/ToDoist/UsersProgressTasks.json", JSON.stringify(oldUserTasks));
    res.end();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
