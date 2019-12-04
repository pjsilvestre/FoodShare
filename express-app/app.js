const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');

// require page routers
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const donationBoardRouter = require('./routes/donation-board');
const donationMapRouter = require('./routes/donation-map');
const profileRouter = require('./routes/profile');
const donationFormRouter = require('./routes/donation-form');
const myDonationsRouter = require('./routes/my-donations');
const myRequestsRouter = require('./routes/my-requests');
const myMessageInboxRouter = require('./routes/message-inbox');
const myMessageSendRouter = require('./routes/message-send');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// use page routers
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/donation-board', donationBoardRouter);
app.use('/donation-map', donationMapRouter);
app.use('/profile', profileRouter);
app.use('/donation-form', donationFormRouter);
app.use('/my-donations', myDonationsRouter);
app.use('/my-requests', myRequestsRouter);
app.use('/message-inbox', myMessageInboxRouter);
app.use('/message-send', myMessageSendRouter);

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
