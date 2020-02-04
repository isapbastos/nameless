//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const https = require('https');
const fs = require('fs');
const sha1 = require("sha1");
const request = require('request');
const app = express();
const PORTA_OKAY = 200;
const PORTA_LOCAL_HTTP = 3000;
const PORTA_LOCAL_HTTPS = 8000;
const MSG_REJEITA_CONEXAO = "SAI FORA";
const MSG_CONEXAO_ACEITA = "SUCESSO";
const options = {
    key: fs.readFileSync('key.pem'), //SSL certificate para criar um servidor htttps
    cert: fs.readFileSync('cert.pem')
};
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-Isadora:431419BttF@cluster0-babnh.mongodb.net/eidro", {useNewUrlParser: true});//conecta o app ao BD do cloud mongodb
//mongoose.connect("mongodb://localhost:27017/testdb"); //conecta o app ao BD local
mongoose.set('useFindAndModify', false); // Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`, by default, you need to set it to false.
const userSchema = new mongoose.Schema ({
    idPublica: String, 
    idPrivada: String,
    medicoes: [{_id: String, 
              timestamp: String,
              leitura: String}]
});

const User = mongoose.model("User", userSchema);

const isa = new User ({
    idPublica: '123456',
    idPrivada: '654321',
    medicoes: [{_id: '123456781', 
              timestamp: '134567309',
              leitura: '0,1,2,3,4,5,6,7'},
              {_id: '123456782', 
              timestamp: '12356777',
              leitura: '0,1,2,3,4,5,7'}]
              
});
const hugo = new User ({
    idPublica: 'abe854',
    idPrivada: 'fk9W21',
    medicoes: [{_id: '123456783', 
              timestamp: '123456009',
              leitura: '0,1,2,3,4,5,6,7'},
              {_id: '123456784', 
              timestamp: '223356789',
              leitura: '0,1,2,3,4,5,7'}]
              
});
console.log(isa);
console.log(hugo);
const defaultUsers = [isa, hugo]; 

const listSchema = {
  name:String,
  users: [userSchema]
};

const List = mongoose.model("List", listSchema);
app.get("/", function(request, res) { //retorna os usuários declarados (defaultUsers)
    User.find({}, function(err, foundUsers){
        if (foundUsers.length === 0){
            User.insertMany(defaultUsers, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Success!");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListUsers: foundUsers});
        }
    }); 
});
 
app.get("/:customListName", function( req, res){
    const customListName = _.capitalize(req.params.customListName);
    let x1a = req.query.x1a; //idPublica
    let x1b = (!isNaN(x1a)) ? JSON.stringify(x1a).replace('"123456"', '654321').replace('"abe854"', 'fk9W21').replace('"anr5kr"', 'f93jc2').replace('"dnuek2"', '29jd90') : null; //esse último retorna null, por que? rearranjar essa função
    let x2 = req.query.x2; //timestamp
    let x3 =  req.query.x3; //leitura
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){ //se não tiver erros
            if(!foundList){
            //create a new list
                const list = new List({
                    name: customListName,
                    users: {
                        idPublica: req.query.x1a,
                        idPrivada: (!isNaN(x1a)) ? JSON.stringify(x1a).replace('"123456"', '654321').replace('"abe854"', 'fk9W21').replace('"anr5kr"', 'f93jc2').replace('"dnuek2"', '29jd90') : null, //faz a conversão da idpública para
                        medicoes: [{_id: Math.floor(Math.random() * 10000000), //o banco só aceita os dados uma vez, como enviar várias medicoes para o mesmo usuário?
                                    timestamp: req.query.x2,
                                    leitura: req.query.x3}]
                            }
                });
                let hash = sha1(x1b+x2+x3); //função para gerar hash sha1
                console.log(hash);
                let x4 = req.query.x4;
                if(x4==hash){ //comparacao do hash. Se igual, aceita a mensagem, caso contrario rejeita
                    console.log(MSG_CONEXAO_ACEITA);
                    list.save();
                    res.send(MSG_CONEXAO_ACEITA);
                    
                    
                } else{
                    res.send(MSG_REJEITA_CONEXAO);
                    console.log(MSG_REJEITA_CONEXAO);
                }
            } else {
                //show an existing list 
                res.render("list", {listTitle: foundList.name, newListUsers: foundList.users});
            }
        }
    });
});

app.post("/delete", function(req, res){//deleta o dado ao clicar no checkbox
    const checkedUserId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today") {
        User.findByIdAndRemove(checkedUserId, function(err){
        if(!err){
            console.log("Success!");
            res.redirect("/");
        }
    });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {users: {_id: checkedUserId }}}, function(err, foundList) {
        if (!err) {
            res.redirect("/" +listName);
        }
        });
    }
});

let port = process.env.PORT;
if(port == null || port == "") {
  port = PORTA_LOCAL_HTTP;
}
app.listen(port, function() {
  console.log("Server is running in port 3000!");
});
https.createServer(options, function (req, res) {
    res.writeHead(PORTA_OKAY);
    console.log("Server is running in port 8000!\n");
}).listen(PORTA_LOCAL_HTTPS);

