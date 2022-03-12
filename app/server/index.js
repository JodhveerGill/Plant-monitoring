// set up a basic express server on port 3000
const express = require('express'); 
const app = express();
const cors = require("cors");
const Temps = require('../database/index.js');
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.static(__dirname + '/../client/dist')); 

app.get('/test', (req, res) => {
  Temps.find().then((data) => res.send(data));
});

app.listen(PORT, () => (console.log(`Currently running on port: ${PORT}`)));

