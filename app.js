var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./controler/databaseConfig/connection')
var session = require('express-session')
let cors = require('cors')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const { head } = require('./routes/user');
const hbs = require('hbs')
require('dotenv').config()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// session

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache,no-store, must-revalidate');
  next()
})
app.use(session({
   secret: process.env.SESSION_KEY, 
   saveUninitialized: true, 
   cookie: { maxAge: 1000000 },
    resave: false }))
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// hbs index number
hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
hbs.registerHelper('count',(val)=>{
return  parseInt(val)= parseInt(val)+1
})

hbs.registerHelper('ifEqual', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// #########//

// database connection
db.connect((err) => {
  if (err) {
    console.log("connetion err" + err);
  }
  console.log("db connected");
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
