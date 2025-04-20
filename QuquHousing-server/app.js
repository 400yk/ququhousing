const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const checkExpire = require('./middleware/checkExpire');
const behaviorTracking = require('./middleware/behaviorTracking');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(credentials); // handle options credentials check, before CORS! 
// app.use(cors());
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false })); // handle urlencoded data
app.use(express.json());
app.use(cookieParser()); // middleware for cookies
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

// order matters, waterfall
app.use('/', require('./routes/index'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth')); 
app.use('/refresh', require('./routes/refresh')); 
app.use('/logout', require('./routes/logout')); 
app.use('/sms', require('./routes/sms'));
app.use('/payNotify', require('./routes/api/payNotify'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));
app.use('/renewal', require('./routes/api/renewal'));
app.use('/profile', require('./routes/api/profile'));
app.use('/order', require('./routes/api/order'));

app.use(checkExpire);
app.use(behaviorTracking); //数据埋点，搜索历史行为数据
app.use('/compounds', require('./routes/api/compounds'));
app.use('/bizcircle', require('./routes/api/bizcircle'));
app.use('/analysis', require('./routes/api/analysis'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
