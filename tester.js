var wifibox = require('./wifibox');
var commands = require('./commands');
var request = require('request');
var moment = require('moment');

// Min:  1099.70458160105
// Max:  1444.30078329347
// Avg:  1291.6311845485336

var date = new Date(Date.now()); 
nearestHour(date); 

function nearestHour(date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  //console.log(date.toISOString());
  console.log(moment(date).utc().format("YYYY-MM-DDTHH:mm:ss") + 'Z');
  return date;
}

var makeRequest = function(cb){
  request('http://www.google.com', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
    }
  })
};

var getColorCode = function(){ 
  // var mylight = new wifibox('192.168.1.100');
  // mylight.command(commands.rgbw.hue(Math.floor(Math.random() * 255)));
  makeRequest(function(data){
    console.log(data);
  });
};

// getColorCode();
// setTimeout(getColorCode, 10000);