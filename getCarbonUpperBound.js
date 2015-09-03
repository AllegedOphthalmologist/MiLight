var request = require('request');
var moment = require('moment');

var getTimeLastWeek = function() {
  // Get time of 7 days ago
  var date = new Date(Date.now() - 604800000); 

  date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
  date.setMinutes(0);
  date.setSeconds(0);

  // console.log(date.toISOString());
  var formattedDate = (moment(date).utc().format("YYYY-MM-DDTHH:mm:ss") + 'Z');
  return formattedDate;
};

var getHighestReading = function(data, cb){
  var max = 0;
  for(var i = 0; i < data.length; i++){
    if(data[i].carbon){
      if(data[i].carbon > max){
        max = data[i].carbon;
        // console.log(max);
      } 
   }
  }
  cb(max);
};

var findMaxCarbonThisWeek = function(cb){
  var base_url = 'https://api.watttime.org/api/v1/datapoints/?ba=CAISO&market=DAHR&page_size=1000'
  var formattedDate = getTimeLastWeek();
  var url = base_url + '&start_at=' + formattedDate;

  console.log("Getting data starting at: ", formattedDate);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(JSON.parse(body).results);
      getHighestReading(JSON.parse(body).results, 
        function(carbonHigh){
          console.log("Highest Carbon Measurement this week: ", carbonHigh);
          cb(carbonHigh);
        });
    }
    else {
      throw error;
    }
  })
};

module.exports = findMaxCarbonThisWeek;