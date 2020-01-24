//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const sha1 = require('sha1');

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response) {
  var x1 = request.query.x1; //idpublica
  var x2 = request.query.x2; //tsta
  var x3 = request.query.x3; //body
  var x4 = 654321; //idprivada
  var hash = sha1(x2+x3+x4);
  if(hash==request.hash){
  console.log("ok");
}
 else {
   console.log("ERROR");
 }
    });
 


app.post("/signup", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
  url:"https://us5.api.mailchimp.com/3.0/lists/58ba608dce",
  method:"POST",
  headers: {
    "Authorization": "isapbastos 1b99f508aa0c0f767d582906210d3000-us5"
  },
body: jsonData
  };

  request(options, function(error, response, body){
    if (error) {
      res.sendFile(__dirname + "/failure.html");
      } else {
        if(response.statusCode ==200){
          res.sendFile(__dirname + "/success.html");
        } else {
          res.sendFile(__dirname + "/failure.html");
        }
      }
});
});

app.get("/signup", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/signup", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
  url:"https://us5.api.mailchimp.com/3.0/lists/58ba608dce",
  method:"POST",
  headers: {
    "Authorization": "isapbastos 1b99f508aa0c0f767d582906210d3000-us5"
  },
body: jsonData
  };

  request(options, function(error, response, body){
    if (error) {
      res.sendFile(__dirname + "/failure.html");
      } else {
        if(response.statusCode ==200){
          res.sendFile(__dirname + "/success.html");
        } else {
          res.sendFile(__dirname + "/failure.html");
        }
      }
});
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running in port 3000!");
});

//API key
//1b99f508aa0c0f767d582906210d3000-us5

//List id
//58ba608dce