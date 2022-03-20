// set up a basic express server on port 3000
const express = require('express'); 
const app = express();
const cors = require("cors");
const Temps = require('../database/index.js');
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.static(__dirname + '/../client/dist')); 

let upperTemp = 20;
let lowerTemp = 0;

app.get('/test', (req, res) => {
  Temps.find().then((data) => res.send(data));
});

app.post('/thresh', (req, res) => {
  console.log(req.query.value); 
  console.log(req.query.name);
  
  switch (req.query.name) {
    case 'upperTemp': 
      upperTemp = req.query.value;
    
    case 'lowerTemp' :
      lowerTemp = req.query.value;
  }
  // threshUpper = req.query.threshUpper;
  res.send(lowerTemp.toString());
});

app.listen(PORT, () => (console.log(`Currently running on port: ${PORT}`)));

