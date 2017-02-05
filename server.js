const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

var app = express();
var mtncMode = false;

const port = process.env.port || 3000;

//set out view engine 
app.set("view engine", 'hbs');

//register partials/segments
hbs.registerPartials(__dirname + "/views/partials");

hbs.registerHelper('getCurrentYear', () => {return new Date().getFullYear()});

//Create our own middleware
app.use((req,res,next) => {
    var msg = `${new Date().toString()}: ${req.method} ${req.url}`
   console.log(msg);
   fs.appendFile("server.log", msg + '\n', (error) => {
       if (error) {
            console.log("Failed to log activity to server.log : " + error);
       }
   })

   //Render mtnc page and don't progress futher if we're in mtnc mode
   if (mtncMode === true) {
       res.render('mtnc.hbs');
   } else {
        next();
   }
});

//define link to public dir (endpoints)
app.use(express.static(__dirname + '/public'));


//get request on root
app.get('/', (request,response) => {
    response.render('home.hbs',{
        title: "WELCOME"
    });
});


app.get('/about', (request,response) => {
    response.render('about.hbs',{
        title: "ABOUT PAGE"
    });
});


//Start server
app.listen(3000, () => {
    console.log("Server is running on port " + port);
});