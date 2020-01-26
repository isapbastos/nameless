//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const sha1 = require("sha1");
const https = require('https');
const fs = require('fs');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const ALL_OKAY = 200;
const PORTA_LOCAL_HTTP = 3000;
const PORTA_LOCAL_HTTPS = 8000;
const MSG_REJEITA_CONEXAO = "SAI FORA";
const MSG_CONEXAO_ACEITA = "SUCESSO";

const options = {
    key: fs.readFileSync('key.pem'), //SSL certificate para criar um servidor htttps
    cert: fs.readFileSync('cert.pem')
};


{[{'idPublica':'123456', 'idPrivada':'654321'},
{'idPublica':'abe854', 'idPrivada':'fk9W21'} ]}

app.get('/', function(request, response) {
    var x1 = request.query.x1; //timeStamp
    var x2 = request.query.x2; //body
    var x3a = request.query.x3a; //idpublica
    var x3b = JSON.stringify(x3a).replace('"123456"', '654321').replace('"abe854"', 'fk9W21').replace('"anr5kr"', 'f93jc2').replace('"dnuek2"', '29jd90');
    var x4 = request.query.x4;
    var hash = sha1(x1+x2+x3b); //função para gerar hash sha1
    if(x4==hash){ //comparacao do hash. Se igual, aceita a mensagem, caso contrario rejeita
        response.send(MSG_CONEXAO_ACEITA);
        console.log(MSG_CONEXAO_ACEITA);
    } else{
        response.send(MSG_REJEITA_CONEXAO);
        console.log(MSG_REJEITA_CONEXAO);
    }

});

app.get("/signup", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

 app.post("/signup", function(req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
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
            if(response.statusCode == ALL_OKAY){
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

app.listen(process.env.PORT || PORTA_LOCAL_HTTP, function() {
    console.log("Server is running in port 3000!");
});

https.createServer(options, function (req, res) {
    res.writeHead(ALL_OKAY);
    res.end("Server is running in port 8000!\n");
}).listen(PORTA_LOCAL_HTTPS);

//API key
//1b99f508aa0c0f767d582906210d3000-us5

//List id
//58ba608dce