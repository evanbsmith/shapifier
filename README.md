# Shapifier

Command-line utility to add polygon fields (e.g., name or ID) to point data. Built on the [geojson-geometries-lookup](https://github.com/simonepri/geojson-geometries-lookup) package, Shapifier provides a command-line interface to handle a common use-case: matching point-based data to shape-based bada based on their geometries (i.e., assign states to cities based on their latitude and longitude alone).

## Installation
```bash
$ npm install -g shapifier
```
## Basic Usage
In the terminal, navigate to the directory containing: (1) a csv file with point data you want to match and (2) a geojson file with the polygons you want to match the points to.

Use the `shapify` command to match points to polygons:
```bash
$ shapifier shapify points.csv polygons.geojson fieldname
```
This will take the points from `points.csv`, compare them to the polygons in `polygons.geojson` and return points-shapified-[timestamp].csv file, which will include a new column with the values from `fieldname`.

For example, if you have `us-cities.csv` (with fields called `latitude` and `longitude`) and want to know what congressional district each city falls in (from `cong-districts.geojson` where `dist-code` is field name for congressional district number), you would call shapify like this:
```bash
$ shapifier shapify us-cities.csv cong-districts.geojson dist-number
```
This will return a csv file identical to `us-cities.csv` with a new column `dist-code` that includes the code from the congressional district each city falls in. Shapifier will return `MULTIPLE` for any cities that match to multiple congressional districts and `NONE` for cities that do not match to any congressional districts.

## Syntax
The `shapify` command has the following `<required>` and `[optional]` arguments:
```bash
$ shapifier shapify <point-file-name> <polygon-file-name> <polygon-field> [latitude-field] [longitude-field]
```
All arguments are case sensitive.
### Arguments
#### 1. point-file-name
__Required__
Name of csv file containing the points you want to match. Does not have to include file extension (e.g., `points.csv` and `points` will both work).

#### 2. polygon-file-name
__Required__
Name of the geojson file containing the polygons you want to match the points to. Does not have to include file extension (e.g., `polygons.geojson` and `polygons` will both work).

#### 3. polygon-field
__Required__
Name of the geojson feature property field that you want to attach to the point data (e.g., name, ID, code, etc.).

#### 4. latitude-field
__Optional__
Name of the csv field containing latitude data for each point. If blank, defaults to `latitude`.

#### 5. longitude-field
__Optional__
Name of the csv field containing longitude data for each point. If blank, defaults to `longitude`.

### Multiple Match Flag
Add the `-m` flag to the shapify command to specify how to handle points that match to more than one polygon. If `-m` flag is included, data will be returned for all matching polygons in a semicolon-separated list. This is useful if your polygon file includes multiple layers of geographic data (e.g., counties and states). If `-m` flag is not included, the default behavior is to return `MULTIPLE` for each point with multiple matches.
