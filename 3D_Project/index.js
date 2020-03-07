
var connect = require('connect');
const mongodb = require('mongodb');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

var fs = require('fs');

const port = 8000;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));



const url = "mongodb://localhost:27017/3D"; 
const options = {
    useUnifiedTopology: true
}; 

mongodb.MongoClient.connect(url, options, (error, client) => {
    if (error) return console.log(error); 
    const db = client.db(); 


    
    app.get('/receive', (req, res) => {
        var output;
		const _id = new mongodb.ObjectID( req.query.id );	
		db.collection('Notifications').findOne( {'_id': _id } , (err, item) => {
			if (err) { res.send({ 'error': 'An error has occured' }); }
			else {
                
                
               if(item.Active == "false"){
                output = "<div class='box'><h1>Now Viewing " + item.Name + "'s Position</h1>" +
                "<p>" + item.Name +" is currently safe.</p> </div>";
               } else{
                   var lat = item.Lat;
                   var lon = item.Lon;
                   
                    var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+lat + "," + lon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyBwHbKH4mS9lrGGB22nThkT6WQagN7zcPs";

               
                 output = "<div class='box'><h1>Now Viewing " + item.Name + "'s Position</h1>" +
                "<p><span style='color:red;'>" + item.Name +" might be in danger.</span><br> Here is their current location:</p> <div style='position:relative;'><i class='fa fa-map-marker fa-3x'></i><img src='"+img_url+"' style='width:100%;'></div></div>";
               }
                
                
                 fs.readFile("home.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
                     html =  output + html;
            res.end(html);
        });

                 
                 }
		});
	});
    

    

    router.get('/request',function(req,res){
  res.sendFile(path.join(__dirname+'/receive.html'));
});
    
    router.get('/send',function(req,res){
  res.sendFile(path.join(__dirname+'/send.html'));
});
    
    
    	app.post('/send', (req, res) => {
		const ping = { tracking: req.body};
		db.collection('Notifications').insertOne(ping, (err, result) => {
			if (err) { res.send({ 'error': 'An error has occured' });	}
			else {	res.send(result.ops[0]);	
                 console.log(result.ops[0]);
                 
                 }
		});
	});



    app.use('/', router);
app.listen(process.env.port || 8000);
    console.log("We are live on " + port);
});



