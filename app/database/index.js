const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sensor');

const db = mongoose.connection;

db.on('error', () => console.log('error connecting to database'));

db.once('open', () => console.log('mongoose connected successfully'));

const Schema = mongoose.Schema;

let tempSchema = new Schema(
  {name: String, timestamp: Date, value: Number}, 
  // {
  // timeseries: {
  //   timeField: "timestamp",
  //   metaField: "metadata",
  //   granularity: "minutes"
  // }}
  );

  //tempSchema.index({timestamp: 1}, {expireAfterSeconds: 60});

const Temp = mongoose.model('Temp', tempSchema);

module.exports = Temp;
