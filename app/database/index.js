const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sensor');

const db = mongoose.connection;

db.on('error', () => console.log('error connecting to database'));

db.once('open', () => console.log('mongoose connected successfully'));

const Schema = mongoose.Schema;

let tempSchema = new Schema(
  {name: String, timestamp: Date, metadata: Object}, 
  {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "minutes"
  }});

  tempSchema.index({timestamp: 1}, {expireAfterSeconds: 60});

const Temp = mongoose.model('Temp', tempSchema);

const test = new Temp({name: 'abc'})
test.save((err) => {
  if (err) {
    console.log(err);
  }
});

// Temp.findOne({name: 'suzy'}, (err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// })
module.exports.temp = Temp;

module.exports.db = db;