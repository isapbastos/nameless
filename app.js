//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const sha1 = require("sha1");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response) {
  var x1 = request.query.x1; //tsta
  var x2 = request.query.x2; //body
  var x3a = request.query.x3a; //idpublica
  var x3b = JSON.stringify(x3a).replace('"123456"', '654321').replace('"abe854"', 'fk9W21').replace('"anr5kr"', 'f93jc2').replace('"dnuek2"', '29jd90');
  
  var x4 = request.query.x4;
  var hash = sha1(x1+x2+x3b);
  if(x4==hash){
  console.log("SUCESSO");
}
 else {
   console.log("SAI FORA");
 }
 response.send("EIDRO");
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