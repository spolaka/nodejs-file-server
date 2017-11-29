// application dependencies
const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const uuid = require('uuid');
var multer = require('multer');


const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true , parameterLimit:500000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log( req.body.cd);
    console.log( file);
    console.log( __dirname);
    cb(null, path.join(__dirname, 'public' , req.body.cd));
  },
  filename: function (req, file, cb) {
    console.log( file.originalname);
    cb(null, file.originalname);
  }
})

var upload = multer({ storage: storage });
//var upload = multer({ dest: 'uploads/' })

app.post('/flupld', upload.single('file'), function (req, res) {
  console.log(req.file);
  console.log(req.body);
  res.send(req.file);  
});

// error handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
