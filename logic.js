const fs = require('fs');
const cvs = require('csv');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const GeoLookupFactory = require('geojson-geometries-lookup');
const files = require('./dirpath');



const shapify = (csvFileName, geojsonFileName, featurePropertyName, latField, longField) => {

  // 0 - variables

  const csvFile = csvFileName.search(/[.]/g) === -1 ? csvFileName : csvFileName.slice(0,csvFileName.search(/[.]/g)) + '.csv';
  const csvFileNoExt = csvFileName.search(/[.]/g) === -1 ? csvFileName : csvFileName.slice(0,csvFileName.search(/[.]/g));
  // console.log('csvFileName', csvFileName);
  // console.log('csvFile', csvFile);
  // console.log('csvFileNoExt', csvFileNoExt);

  const geojsonFile = geojsonFileName.search(/[.]/g) === -1 ? geojsonFileName : geojsonFileName.slice(0,geojsonFileName.search(/[.]/g)) + '.geojson';
  const geojsonFileNoExt = geojsonFileName.search(/[.]/g) === -1 ? geojsonFileName : geojsonFileName.slice(0,geojsonFileName.search(/[.]/g));
  // console.log('geojsonFileName', geojsonFileName);
  // console.log('geojsonFile', geojsonFile);
  // console.log('geojsonFileNoExt', geojsonFileNoExt);
  
  const featureProperty = featurePropertyName;

  const lat = latField || 'latitude';
  const long = longField || 'longitude';

  // 1 - READ AND PARSE CSV

  let rawCSVdata = fs.readFileSync(csvFile);

  let csvData = parse(rawCSVdata, {columns: true});
  // console.log(csvData);

  // 2 - READ AND PARSE GEOJSON

  let rawJSONdata = fs.readFileSync(geojsonFile);
  let geojsonData = JSON.parse(rawJSONdata);
  // console.log(geojsonData);

  // 3 - find geojson polygon for each point in csv

  const geolookup = new GeoLookupFactory(geojsonData);

  // iterate over cvsData, create point from latitude and longitude fields, use point to lookup geometry, add specified field value to csvData record

  // TO DO how to handle errors?

  let counts = {
    single : 0,
    multiple : 0,
    nomatch : 0
  };

  let csvShapified = csvData.map(function(el){
    // console.log('iterating!', el);


    const point = {type: "Point", coordinates: [parseFloat(el[long]), parseFloat(el[lat])]};
    // console.log(point);
    let geolookupResult = geolookup.getContainers(point);
    if (geolookupResult.features.length === 1) {
      let firstContainer = geolookupResult.features[0];
      // console.log('Lookup Results:',firstContainer.properties[featureProperty]);
      el[featureProperty] = firstContainer.properties[featureProperty];
      // console.log('transformed el', el);
      counts.single++;
      return el;
    }
    else if (geolookupResult.features.length > 1) {
        // what to do if more than 1 match?
        el[featureProperty] = 'MULTIPLE';
        // console.log('transformed el', el);
        counts.multiple++;
        return el;
    }
    else {
      // console.log("Lookup not found", geolookupResult);
      el[featureProperty] = 'NONE';
      // console.log('transformed el', el);
      counts.nomatch++;
      return el;
    }

  });
  // console.log('csvShapified: ', csvShapified);

  // 4 - stringify records and save to csv

  let csvGeo = stringify(csvData, {header: true});

  const outputFileName = csvFileNoExt + '-shapified-' + Date.now() + '.csv';

  fs.writeFile(outputFileName,csvGeo,'utf8',function(err){
    if (err){
      return console.log(err);
    }
    console.log("Points Matched (Single): ",counts.single);
    console.log("Points Matched (Multiple): ",counts.multiple);
    console.log("Points Not Matched: ",counts.nomatch);
    console.log("Output saved as " + files.getCurrentDirectoryBase() + "/" + outputFileName);
  });
};

module.exports = shapify;
