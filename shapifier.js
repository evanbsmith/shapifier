#!/usr/bin/env node

const program = require('commander');

const shapify = require('./logic');
const files = require('./dirpath');

program
  .version('0.0.1')
  .description('Shapifier - Add geojson feature property to csv point data');

program
  .command('shapify <csvFileName> <geojsonFileName> <featurePropertyName> [latField] [longField]')
  .alias('s')
  .description('Shapify CSV point data by adding polygon geojson field')
  .action((csvFileName, geojsonFileName, featurePropertyName, latField, longField) => {
    console.log('Shapifier Engaged!');
    // console.log('Current Path: ', files.getCurrentDirectoryBase());
    shapify(csvFileName, geojsonFileName, featurePropertyName, latField, longField);
  });

program.parse(process.argv);
