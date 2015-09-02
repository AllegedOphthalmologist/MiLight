var wifibox = require('./wifibox');
var commands = require('./commands');




var mylight = new wifibox('192.168.1.100');


var changeColor = function(){
  var context = this;
  // console.log(context);
  setTimeout(function(){ 
      mylight.command(commands.rgbw.hue(Math.floor(Math.random() * 255)));
      changeColor();
    }, 2000);
}

//changeColor();
mylight.command(commands.rgbw.on(3));

//hue
// console.log('done');
