const express = require('express');
const app = express();
const bodyParser = require('body-parser');  
const cors = require('cors'); 
const port = process.env.PORT || 3000;;
var rout = require('./routs/Routes');
app.set('view engine', 'ejs');
app.set('viewa', './views');


app.use(cors()); 

 app.use(bodyParser.json()); 
 // Express modules / packages 

 app.use(bodyParser.urlencoded({ extended: true })); 
 // Express modules / packages 

 app.use('/', rout);
 app.use('/member', rout);
 app.use('/mailer', rout);
 app.use('/img', rout);
 app.use('/pdf', rout);



app.listen(port, () => { // Listen on port 3000 
    console.log(`Listening! in port: ${port}`); // Log when listen success 
});

