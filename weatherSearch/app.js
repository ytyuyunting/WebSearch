var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//cross


var bodyParser = require('body-parser'); // Parse HTTP request body.
app.use( bodyParser.json() );      // to support JSON-encoded bodies (create application/json jiexi).
//
app.get('/a',(request, response)=> {
  console.log(request.query);
  response.send("永远18岁");
  response.end();
});

//input address to get weather(using darksky api and google map geocode api)
app.get('/location', function(req, res) {
  var street = req.query.street;
  var city = req.query.city;
  var state = req.query.state;
  var address= ""+ street+ ","+ city +"," +state;
  console.log(address);
  var googleGeoUrl_orign="https://maps.googleapis.com/maps/api/geocode/json?address="+ address+ "&key=AIzaSyA6RvecEUdcr-L2y2jhgZm4kAC48R5oztw";
  var googleGeoUrl =encodeURI(googleGeoUrl_orign);
  var lat="";
  var lng ="";

  //Using Request Module to get latitude and longtitude
  var request = require("request");
  request(googleGeoUrl, function(error, response, body) {
    if(!error && JSON.parse(body).status=="OK"){
      var geo_obj= JSON.parse(body);
      lat = geo_obj.results[0].geometry.location.lat;
      lng = geo_obj.results[0].geometry.location.lng;
      var forecastUrl_orign = "https://api.forecast.io/forecast/d5062d78314026eaa99e5defc672c3ae/"+encodeURI(lat+","+lng);
      var forecastUrl = encodeURI(forecastUrl_orign);
      console.log("forecastUrl:"+forecastUrl);
      //Using Request Module to get json about weather info
      request(forecastUrl, function(error, response, body) {
        if(!error){
          var forecast_obj= JSON.parse(body);
          res.json(forecast_obj);
          console.log("Successfully getWeather!");
        }
        else{ return res.send("Error: getGeocode ");}
      });
    }
    else{ return res.send("Error: getGeocode ");}
  });
});



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
