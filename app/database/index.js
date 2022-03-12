const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sensor');

const db = mongoose.connection;

db.on('error', () => console.log('error connecting to database'));

db.once('open', () => console.log('mongoose connected successfully'));

const Schema = mongoose.Schema;

let tempSchema = new Schema(
  {name: String, timestamp: Date, metadata: Object, value: Number}, 
  {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "minutes"
  }});

  tempSchema.index({timestamp: 1}, {expireAfterSeconds: 60});

const Temp = mongoose.model('Temp', tempSchema);

// const test = new Temp([{value: 5}, {value: 10}, {value: 12}, {value: 19}, {value: 22}, {value: 31}, {value: 22}, {value: 17}, {value: 11}]);
// test.save((err) => {
//   if (err) {
//     console.log(err);
//   }
// });
// Temp.create([{value: 5}, {value: 10}, {value: 12}, {value: 19}, {value: 22}, {value: 31}, {value: 22}, {value: 17}, {value: 11}], (err) => {console.log(err)});

// Temp.findOne({name: 'suzy'}, (err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// })
module.exports = Temp;

// module.exports.db = db;