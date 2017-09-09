 'use strict';

 var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
 var Message = require('azure-iot-device').Message;

 var connectionString = 'HostName=enesprod.azure-devices.net;DeviceId=test1;SharedAccessKey=nUTApj99QseDBbcM+88Gg8K7ykNSImrwd9pFlWxT+ug=';

 var client = clientFromConnectionString(connectionString);

 function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }

   var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');
     client.on('message', function (msg) {
       console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
       client.complete(msg, printResultFor('completed'));
     });
     // Create a message and send it to the IoT Hub every second
     setInterval(function(){
         var temperature = 20 + (Math.random() * 15);
         var humidity = 60 + (Math.random() * 20);  
         //{Machine:{...}, Sensor:{Temperature:{Value:123}}, Result:{...}}          
         var data = JSON.stringify({Machine:{ deviceId: 'myFirstNodeDevice-3'}, Sensor:{Temperature:{Value:temperature},Humidity:{Value:temperature}}, Result:{} });
         var message = new Message(data);
       //  message.properties.add('temperatureAlert', (temperature > 0) ? 'true' : 'false');
         console.log("Sending message: " + message.getData());
         client.sendEvent(message, printResultFor('send'));
     }, 1000);
   }
 };

  
  client.open(connectCallback);
 