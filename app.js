var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
require('dotenv').load();
const Cortex = require('./lib/cortex');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(6001, function(err, res) {
  if(err) {
    console.log("Error in listening to the server on port 6001");
    return;
  }
  console.log("Server listening on port 6001!");
  // run user login and auth flow here
  console.log("Running user login/auth flow for Cortex");

  const client = new Cortex({})
    // login details
    const auth = {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      debit: 1 // first time you run example debit should > 0
    };
    // making sure all sessions are closed before opening a new one
    var closePreviousSessions = function(res) {
      return new Promise(function(resolve, reject) {
        console.log("res.length is: ", res.length);
      if(res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          var sessionID = res[i].id;
          console.log(res[i].id);
          if(res[i].status != "closed") {
            console.log("updating session status to closed");
            client.updateSession({ session: sessionID, status: "closed" })
            .then((res) => {
              console.log("successfully closed session: ", res.id);
            }, (err) => {
              // console.log("error in closing session ", sessionID, ": ", err);
              reject("error in closing session", sessionID, ": ", err);
            })
          }
        }
        resolve('Successfully closed all sessions');
      } else {
          resolve('No sessions present');
        }
      });
    }
  client.ready.then(function() {
    client.init(auth)
    .then(res => {
      // console.log("init success response: ", res);
      // creating new session
      client.querySessions().then((res) => {
        console.log("successfully queried sessions: ");
        console.log(res);
        console.log("closing sessions");

        client.querySessions({ query: {status: "activated"} }).then((res) => {
          console.log("sessions that are active: ", res);
          if(res.length == 1) {
            console.log("this is ID from querySessions: ", res[0].id);
            var session = res[0].id;
            // subscribing to eeg data
            // client.subscribe({ streams: ["eeg"], session: res[0].id })
            // .then((res) => {
            //   console.log("successfully subscribed to eeg");
            //   console.log(res);
            // }, (err) => {
            //   console.log("error subscribing to eeg");
            //   console.log(err);
            // })

            // subscribing to pow data
            client.subscribe({ streams: ["pow"], session: session })
            .then((res) => {
              console.log("successfully subscribed to pow");
              console.log(res);
            }, (err) => {
              console.log("error subscribing to pow");
              console.log(err);
            })
          } else if((res.length > 0) && (res.length != 1)) {
            throw new Error('Something went wrong subscribing to session');
          } else {
            client.createSession({ status: "active" })
            .then((res) => {
              console.log("successfully created session");
              console.log(res);
              // subscribing to eeg data
              client.subscribe({ session: res.id, streams: ["eeg"] })
              .then((res) => {
                console.log("successfully subscribed to eeg");
                console.log(res);
              }, (err) => {
                console.log("error subscribing to eeg");
                console.log(err);
                client.updateSession({ session: res.id, status: "close"})
                .then((res) => {
                  console.log("Session closed due to error");
                }, (err) => {
                  console.log("Error closing out of session (due to error subscribing)");
                })
                console.log(err);
              }).then((res) => {
                client.updateSession({ session: res.id, status: "close" })
                .then((res) => {
                  console.log("session is now closed");
                }, (err) => {
                  console.log("error closing session");
                })
              })
            }, (err) => {
              console.log("error creating session: ");
              console.log(err);
            })
          }
        });
      });
    }, (err) => console.log("error in initialization: ", err))
  }, function(err) {
    console.log(err);
  })
})

module.exports = app;