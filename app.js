var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
require('dotenv').load();
var net = require('net');
JsonSocket = require('json-socket');

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

function creatingTCPConnection() {
  // here we actually need this NodeJS server to be a client
  // since it's sending stuff over to the game
  // var HOST = '127.0.0.1';
  // var PORT = 6969;
  // var tcpClient = new net.Socket();
  // tcpClient.connect(PORT, HOST, function() {
  //   console.log('CONNECTED TO: ' + HOST + ':' + PORT);
  //
  // })
}

function createSessionAndSubscribe(client) {
  // creating session
  client.createSession({ status: "active" })
  .then((res) => {
    console.log("successfully created session");
    console.log(res);
    // loading profile
    client.setupProfile({ headset: res.headset.id, status: "load", profile: "chris" })
    .then((res) => {
    // subscribing to com data
      client.subscribe({ session: res.id, streams: ["com"] })
      .then((res) => {
        // comObject contains values needed to send over to game
        // can add more values to current when needing to add extras
        const comObject = {
          command: "neutral",
          pow: 0
        };
        // cleaning up mental command event data
        const columns2obj = headers => cols => {
          const obj = {};
          for (let i = 0; i < cols.length; i++) {
            obj[headers[i]] = cols[i];
          }
          return obj;
        };

        // TODO: put this in own function
        var HOST = '127.0.0.1';
        var PORT = 6002;
        var tcpClient = new JsonSocket(new net.Socket());
        tcpClient.connect(PORT, HOST);
        tcpClient.on('connect', function() {
          console.log('CONNECTED TO: ' + HOST + ':' + PORT);
          tcpClient.sendMessage({ hi: "hi" }, function(message) {
            console.log('the result is: ', message);
          });
        })

        // TODO: put onCom and com2obj in own function
        const com2obj = columns2obj(res[0].com.cols);
        const onCom = ev => {
          const data = com2obj(ev.com);
          // defining threshold power data (when should we recognize a change)
          const threshold = 0.3;
          console.log("data.act: ", data.act);
          console.log('data.pow: ', data.pow);
          // if (data.act !== comObject.command && data.pow >= threshold) {
          if((data.act == "neutral" && comObject.command != "neutral") || data.pow >= threshold) {
            console.log("change in data!");
            console.log("data.act: ", data.act);
            console.log('data.pow: ', data.pow);
            comObject.command = data.act;
            comObject.pow = data.pow;
            console.log("comObject is: ");
            console.log(comObject);
            console.log("sending comObject over tcp");
            tcpClient.sendMessage(comObject, function(err) {
              if(err) {
                console.log('error sending message');
                console.log(err);
              } else {
                console.log('success sending message');
              }
            });
            // onResult(Object.assign({}, current));
          }
        };


        // const onCom = ev => console.log("com event called!", ev);
        client.on("com", onCom);
        console.log("successfully subscribed to com");
        console.log(res);

        const onPow = ev => console.log("pow event called!", ev);
        client.on("pow", onPow);
        const onAct = ev => console.log("act event called!", ev);
        client.on("act", onAct);
      }, (err) => {
        console.log("error subscribing to com");
        console.log(err);
        client.updateSession({ session: res.id, status: "closed"})
        .then((res) => {
          console.log("Session closed due to error");
        }, (err) => {
          console.log("Error closing out of session (due to error subscribing)");
        })
        console.log(err);
      })
    })
  }, (err) => {
    console.log("error creating session: ");
    console.log(err);
  })
}

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
  client.ready.then(function() {
    client.init(auth)
    .then(res => {
      client.querySessions().then((res) => {
        client.querySessions({ query: {status: "activated"} }).then((res) => {
          console.log("sessions that are active: ", res);
          console.log("# of sessions active: ", res.length);
          if(res.length == 1) {
            // THIS SHOULD NEVER BE CALLED
            console.log("this is ID from querySessions: ", res[0].id);
            var sessionID = res[0].id;
            client.updateSession({ session: sessionID, status: "close" })
            .then((res) => {
              console.log("calling createSessionAndSubscribe")
              console.log("res: ", res);
              createSessionAndSubscribe(client);
            }, (err) => {
              console.log("error updating session: ");
              console.log(err);
            })
          } else if((res.length > 0) && (res.length != 1)) {
            // THIS SHOULD ALSO NEVER BE CALLED
            throw new Error('Something went wrong subscribing to session');
          } else {
            // THIS IS WHAT SHOULD BE GETTING CALLED
            createSessionAndSubscribe(client);
          }
        });
      });
    }, (err) => console.log("error in initialization: ", err))
  }, function(err) {
    console.log(err);
  })
})

module.exports = app;
