var connect = require('connect');
const mongodb = require('mongodb');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

var fs = require('fs');

const port = 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));



var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.2.45.28:27017/3D";


var latlon;

var serial; // variable to hold an instance of the serialport library
var options = {
    baudRate: 9600
}; // set baudrate to 9600; must match Arduino baudrate

var portName = '/dev/ttyACM0';
var buttonState = false;
var locating = false;
var counter = 0;
function setup() {
 
     serial = new p5.SerialPort(); // make a new instance of the serialport library
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.open(portName, options); // open a serial port @ 9600
}

function draw() {
    
    
    
    
 if(buttonState == true){
     counter++;
     if(locating == false){
         getLocation();
         locating = true;
        
         }
     
     //locationUpdate(counter);
 }else if(buttonState == false){
     //console.log("Off");
     locating=false;
 }
}

function serialEvent() {
   
    var inData = serial.readStringUntil('\r\n');
    
    if (inData == 1) {
      buttonState = true;
        
    }
    else if(inData == 0) {
     buttonState = false;   
    }
console.log("the button is :" + inData);
   
}



function serverConnected() {
    print('connected to server.');
}

function portOpen() {
    print('the serial port opened.')
}

function serialError(err) {
    print('Something went wrong with the serial port. ' + err);
}

function portClose() {
    print('The serial port closed.');
}

function closingCode() {
    serial.close(portName);
    return null;
}



function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } 
}

function showPosition(position) {
 
  latlon = position.coords.latitude + "," + position.coords.longitude;

  
console.log(latlon);
}
//function locationUpdate(counter){
//    if (counter== 1000){
//        locating = false;
//        counter =0;
//    }
//}

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
    
    if(buttonState==true){
  var dbo = db.db("3D");
  var myquery = { '_id': "5e61ac631e0722c302d9b761" };
  var newvalues = { $set: {Location: latlon, Active: "true" } };
}else{
 var dbo = db.db("3D");
  var myquery = { '_id': "5e61ac631e0722c302d9b761" };
  var newvalues = { $set: {Location: latlon, Active: "true" } };  
    
}
  dbo.collection("Notifications").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
});

app.use('/', router);
app.listen(process.env.port || 3000);
    console.log("We are live on " + port);

  router.get('/index.html',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
