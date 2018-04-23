# Shapifier

Command-line utility to add polygon fields (e.g., name or ID) to point data. Built on the [geojson-geometries-lookup](https://github.com/simonepri/geojson-geometries-lookup) package, Shapifier provides a command-line interface to handle a common use-case: matching point-based data to shape-based bada based on their geometries (i.e., assign states to cities based on their latitude and longitude alone).

## Installation
```bash
$ npm install -g shapifier
```
## Basic Usage
Use the `shapify` command to match points to polygons:
```bash
$ shapifier shapify points.csv polygons.geojson fieldname
```
This will take the points from `points.csv`, compare them to the polygons in `polygons.geojson` and return points-shapified-[timestamp].csv file, which will include a new column with the values from `fieldname`.

For example, if you have `us-cities.csv` (with fields called latitude and longitude) and want to know what congressional district each city falls in (from `cong-districts.geojson` where `dist-code` is field name for congressional district number), you would call shapify like this:
```bash
$ shapifier shapify us-cities.csv cong-districts.geojson dist-number
```
This will return a csv file identical to `us-cities.csv` with the addition of a column `dist-code` that includes the code from the congressional district each city falls in.

## Options
