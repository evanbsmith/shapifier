#!/usr/bin/env node

const program = require('commander');

const shapify = require('./logic');

program
  .version('0.1.0')
  .description('Shapifier - Add geojson feature property to csv point data');

program
  .command('shapify <csvFileName> <geojsonFileName> <featurePropertyName> [latField] [longField]')
  .option('-m, --multiple','Return multiple matches in semicolon-separated list')
  .alias('s')
  .description('Shapify CSV point data by adding polygon geojson field')
  .action((csvFileName, geojsonFileName, featurePropertyName, latField, longField, command) => {
    shapify(csvFileName, geojsonFileName, featurePropertyName, latField, longField, command.multiple);
  });
program.parse(process.argv);
