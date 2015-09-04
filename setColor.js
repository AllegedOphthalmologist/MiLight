var wifibox = require('./wifibox');
var getCarbonUpperBound = require('./getCarbonUpperBound');

var commands = require('./commands');
var request = require('request');
var moment = require('moment');

var weeklyMaxCarbon = 1405;
var weeklyMinCarbon = 900;
var miLightIP = '192.168.1.100';

function getNearestHour() {
  var date = new Date(Date.now()); 

  date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
  date.setMinutes(0);
  date.setSeconds(0);

  //console.log(date.toISOString());
  var formattedDate = (moment(date).utc().format("YYYY-MM-DDTHH:mm:ss") + 'Z');
  return formattedDate;
}

var getCarbonReading = function(wattimeArray, datestring, cb){
  for(var i = 0; i < wattimeArray.length; i++){
    if(wattimeArray[i].timestamp === datestring){
      cb(wattimeArray[i].carbon);
      break;
    }
  }
}

var makeWattTimeRequest = function(){
  var base_url = 'https://api.watttime.org/api/v1/datapoints/?ba=CAISO&market=DAHR'
  var formattedDate = getNearestHour();
  var url = base_url + '&start_at=' + formattedDate;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(JSON.parse(body).results);
      getCarbonReading(JSON.parse(body).results, formattedDate, 
        function(carbon){
          setColorCode(carbon);
        });
    }
    else {
      console.log(response);
    }
  })
};

var setColorCode = function(carbon){
  
  // divide current carbon rating by highest seen this month
  // to get % of maximum, the multiply that % by the hue range to
  // get the color of the bulb
  // bulb hue range is 0-255 -- Green - Red range is 90-170 (80 points)
  // So, multiply % of max by 80 and add the result to 90 to get the correct
  // point in the range.

  var carbonRange = weeklyMaxCarbon - weeklyMinCarbon;
  var percentMax = (carbon - weeklyMinCarbon)/carbonRange;
  if(percentMax > 1){percentMax = 1};
  if(percentMax < 0){percentMax = 0};

  var hueOffset = Math.floor(80*percentMax);
  var hue = 80 + hueOffset;

  console.log('Setting hue to ' + hue + ' based on carbon ' + carbon);
  var mylight = new wifibox(miLightIP);
  mylight.command(commands.rgbw.hue(hue));
};

// 3600000 Milliseconds in an hour
setInterval(function(){
  getCarbonUpperBound(function(maxCarbon){
    console.log("Max carbon reading this week: ", maxCarbon);
    weeklyMaxCarbon = maxCarbon;
  });
}, 3600000);

// Check for new value every 10 minutes
setInterval(makeWattTimeRequest, 600000);

// Run to set initial value
makeWattTimeRequest();
