const express = require('express');
const app = express();
const bodyParser = require('body-parser');  
const cors = require('cors'); 
const path = require('path');
const port = process.env.PORT || 3000;;
var rout = require('./routs/Routes');
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

app.use(cors()); 

 app.use(bodyParser.json()); 
 // Express modules / packages 

 app.use(bodyParser.urlencoded({ extended: true })); 
 // Express modules / packages 

 app.use('/', rout);
app.use('/ejs', rout);
 app.use('/member', rout);
 app.use('/mailer', rout);
 app.use('/img', rout);
 app.use('/pdf', rout);
app.use('/list', rout);
app.use('/listUpdate', rout);
app.use('/listDelete', rout);
app.use('/calender', rout);
app.use('/calenderteste', rout);
app.use('/calender/entrance', rout);
app.use('/registerEntrance', rout);
app.use('/pass', rout);
app.use('/planget', rout);



app.listen(port, () => { // Listen on port 3000 
    console.log(`Listening! in port: ${port}`); // Log when listen success 
});

