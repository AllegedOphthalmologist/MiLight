var wifibox = require('./wifibox');

var commands = require('./commands');
var request = require('request');
var moment = require('moment');

var miLightIP = '192.168.1.199';

var makeRequest = function(){
  var url = 'http://grid-aware.herokuapp.com/api/bulbcolor'

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(JSON.parse(body));
      setColorCode(JSON.parse(body));
    }
    else {
      console.log(response);
    }
  })
};

var setColorCode = function(percentMax){
  
  var hueOffset = Math.floor(80*percentMax);
  var hue = 80 + hueOffset;

  console.log('Setting hue to ' + hue + ' based on percentMax ' + percentMax);
  var mylight = new wifibox(miLightIP);
  mylight.command(commands.rgbw.hue(hue));
};

makeRequest();

