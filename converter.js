'use strict';

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const parser = xml2js.parseString;

const inputFolder = './KML/';
const outputFolder = './GPX/';

const pathToFiles = (folder) => {
    return path.join(__dirname, folder);
};

// https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options
fs.readdirSync(inputFolder).forEach(file => {

    if (file.includes('.kml') || file.includes('.KML')) {
        
        // https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
        fs.readFile(`${pathToFiles(inputFolder)}${file}`, 'utf8', (err, data) => {
            if (err) throw err;

            // Start of the file
            let content = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<gpx version="1.1" creator="mmkml2gpx 2.0.0" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n';

            parser(data, (err, result) => {
                if (err) throw err;

                content += `<metadata>\n  <name>${result.kml.Document[0].name}</name>\n</metadata>\n`;

                if (typeof(result.kml.Document[0].Placemark) !== 'undefined') {

                    result.kml.Document[0].Placemark.forEach(elem => {

                        let coordinatesToLatLon = (coordinates) => {
                            let array = coordinates.split(',');
                            // Lat = 1, Lon = 0
                            return array
                        };

                        let styleToColor = (style) => {
                            if (style == '#placemark-brown') {
                                // OsmAnd Magenta, Guru Maps Emerald
                                return ['#9c27b0', 28]
                            } else if (['#placemark-green', '#placemark-teal', '#placemark-lime'].includes(style)) {
                                // OsmAmd Green, Guru Maps Green
                                return ['#3f51b5', 29]
                            } else if (['#placemark-orange', '#placemark-deeporange'].includes(style)) {
                                // OsmAmd Orange, Guru Maps Orange
                                return ['#ff5722', 27]
                            } else if (['#placemark-pink', '#placemark-gray', '#placemark-bluegray'].includes(style)) {
                                // OsmAmd Gray, Guru Maps Gray, becuse pink was a piramy color in maps.me and should be different
                                return ['#607d8b', 73]
                            } else if (['#placemark-purple', '#placemark-deeppurple'].includes(style)) {
                                // OsmAmd Purple, Guru Maps Magenta
                                return ['#3f51b5', 26]
                            } else if (style == '#placemark-red') {
                                // OsmAnd Red, Guru Maps Red
                                return ['#e91e63', 72]
                            } else if (style == '#placemark-yellow') {
                                // OsmAnd Yellow, Guru Maps Blue, becuse there is no similar color
                                return ['#ffb300', 0]
                            } else if (['#placemark-blue', '#placemark-lightblue', '#placemark-cyan'].includes(style)) {
                                // OsmAnd Blue, Guru Maps Blue
                                return ['#2196f3', 0]
                            } else {
                                // «Default» color in case of nonstandard style
                                return ['#2196f3', 0]
                            }
                        };

                        const placemark = {
                            wpt: {
                                '$': {
                                    lat: coordinatesToLatLon(elem.Point[0].coordinates[0])[1],
                                    lon: coordinatesToLatLon(elem.Point[0].coordinates[0])[0]
                                },
                                name: elem.name,
                                time: elem.TimeStamp[0].when[0],
                                extensions: [{
                                    color: [styleToColor(elem.styleUrl[0])[0]]
                                }],
                                type: styleToColor(elem.styleUrl[0])[1]
                            }
                        }

                        if (elem.description) {
                            placemark.wpt.desc = elem.description;
                        }

                        // https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class
                        let builder = new xml2js.Builder({
                            headless: true
                        });
                        let jsonToXml = builder.buildObject(placemark);

                        content += `${jsonToXml}
`;
                    });
                } else {
                    console.log('No placemarks for convertation');
                }

                // End of the file
                content += '</gpx>';

                // https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
                fs.writeFile(`${pathToFiles(outputFolder)}${result.kml.Document[0].name}.gpx`, content, (err) => {
                    if (err) throw err;
                    console.log(`✔︎ "${result.kml.Document[0].name}" converted`);
                });
            });
        });
    }
});