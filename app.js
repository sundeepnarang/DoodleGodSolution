const express             = require('express');
const path                = require('path');
const favicon             = require('serve-favicon');
const logger              = require('morgan');
const cookieParser        = require('cookie-parser');
const bodyParser          = require('body-parser');
const busboy              = require('connect-busboy');
const timeout             = require('connect-timeout');
const flash               = require('connect-flash');
const fs                  = require('fs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


logger.token('remote-proxy-ip', function getId(req) {
    if(req.headers){
        return req.headers['x-forwarded-for'];
    }
    return "Null";
});

const logDirectory = __dirname + '/accessLogs';

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

app.use(timeout(120000));
app.use(logger(' [:date[clf]] :sqluser :method :url :status :response-time ms - :res[content-length] :remote-proxy-ip'));
app.use(logger(' [:date[clf]] | :remote-proxy-ip | :sqluser | ":method | :url | HTTP/:http-version" | :status | :response-time ms | :res[content-length] | :referrer | :user-agent', {stream: accessLogStream}));


app.use(cookieParser());


app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '100mb' }));
app.use(
    busboy(
        {
            limits: {
                fileSize  : 100 * 1024 * 1024,
                fieldSize : 100 * 1024 * 1024
            }
        }
    )
);

app.use(flash());


app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib',express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/sec16', sec16);
app.use('/p2h', p2h);
app.use('/externalJobQueries', externalJobQueries);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
