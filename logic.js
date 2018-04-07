const fs = require('fs');
const cvs = require('csv');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const GeoLookupFactory = require('geojson-geometries-lookup');

// 0 - variables

const geometryNameField = 'NAME_EN';
const csvFile = 'acled-tunisia.csv';
const geojsonFile = 'test.geojson';

const latField = '';
const longField = '';

// 1 - READ AND PARSE CSV

let rawCSVdata = fs.readFileSync(__dirname + '/' + csvFile);

let csvData = parse(rawCSVdata, {columns: true});
// console.log(csvData);

// 2 - READ AND PARSE GEOJSON

let rawJSONdata = fs.readFileSync(__dirname + '/' + geojsonFile);
let geojsonData = JSON.parse(rawJSONdata);
// console.log(geojsonData);

// 3 - find geojson polygon for each point in csv

const geolookup = new GeoLookupFactory(geojsonData);

// iterate over cvsData, create point from latitude and longitude fields, use point to lookup geometry, add specified field value to csvData record

// TO DO how to handle errors?

let csvShapified = csvData.map(function(el){
  // console.log('iterating!', el);

  const point = {type: "Point", coordinates: [parseFloat(el.longitude), parseFloat(el.latitude)]};
  // console.log(point);
  let geolookupResult = geolookup.getContainers(point);
  if (geolookupResult.features.length === 1) {
    let firstContainer = geolookupResult.features[0];
    // console.log('Lookup Results:',firstContainer.properties[geometryNameField]);
    el[geometryNameField] = firstContainer.properties[geometryNameField];
    // console.log('transformed el', el);
    return el;
  }
  else if (geolookupResult.features.length > 1) {
      // what to do if more than 1 match?
      el[geometryNameField] = 'MULTIPLE';
      // console.log('transformed el', el);
      return el;
  }
  else {
    // console.log("Lookup not found", geolookupResult);
    el[geometryNameField] = 'NONE';
    // console.log('transformed el', el);
    return el;
  }

});
console.log('csvShapified: ', csvShapified);

// 4 - stringify records and save to csv

let csvGeo = stringify(csvData, {header: true});

fs.writeFile(__dirname + '/csvtest.csv',csvGeo,'utf8',function(err){
  if (err){
    return console.log(err);
  }
  console.log("The file was saved!");
});
