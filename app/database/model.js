const db = require('./index.js');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// let tempSchema = new Schema({
//   timeseries: {
//     timeField: "timestamp",
//     metaField: "metadata",
//     granularity: "minutes"
//   },
//   expireAfterSeconds: 9000
// });

let tempSchema = new Schema(
  {name: String, timestamp: Date, metadata: Object}, 
  {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "minutes"
}});

const Temp = mongoose.model('Temp', tempSchema)

Temp.findOne({name: 'suzy'}, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
})
module.exports = Temp;