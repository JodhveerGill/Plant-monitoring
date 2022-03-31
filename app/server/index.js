// set up a basic express server on port 3000
const express = require('express');
const app = express();
const cors = require("cors");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Temps = require('../database/index.js');
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.static(__dirname + '/../client/dist'));

let upperTemp = 0;
let lowerTemp = 0;
let upperHumidity = 0;
let lowerHumidity = 0;

app.get('/getData', (req, res) => {
  Temps.find({name: req.query.name}).sort({ _id: -1 }).limit(10).then((data) => res.send(data.reverse()));
});

app.post('/thresh', (req, res) => {
  switch (req.query.name) {
    case 'upperTemp':
      upperTemp = req.query.value;

    case 'lowerTemp':
      lowerTemp = req.query.value;

    case 'upperHumidity':
      upperHumidity = req.query.value;

    case 'lowerHumidity':
      lowerHumidity = req.query.value;
  }
  // threshUpper = req.query.threshUpper;
  res.send('success');
});

app.post('/addData', (req, res) => {
  var myData = new Temps(req.body);
  myData.save({ name: myData.name, timestamp: myData.timestamp, value: myData.value })
    .then((response) => {
      console.log(response + "item saved to database");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
})

app.listen(PORT, () => (console.log(`Currently running on port: ${PORT}`)));

