'use strict';

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const parser = xml2js.parseString;

const inputFolder = './KML/';

const pathToFiles = (folder) => {
    return path.join(__dirname, folder);
};

fs.readdirSync(inputFolder).forEach(file => {
    
    if (file.includes('.kml') || file.includes('.KML')) {

        fs.readFile(`${pathToFiles(inputFolder)}${file}`, 'utf8', (err, data) => {
            if (err) throw err;

            parser(data, (err, result) => {
                if (err) throw err;

                if (typeof(result.kml.Document[0].Placemark) !== 'undefined') {
                
                    for (let i = 1; i < result.kml.Document[0].Placemark.length - 1; i++) {
                    
                        // https://stackoverflow.com/a/18024006 
                        let previouseDate = new Date(result.kml.Document[0].Placemark[i-1].TimeStamp[0].when[0]);
                        let currentDate = new Date(result.kml.Document[0].Placemark[i].TimeStamp[0].when[0]);
                        let diff = currentDate - previouseDate;

                        if (diff < 0) {
                            console.log(`${file} / ${result.kml.Document[0].Placemark[i].name} -- is not in chronological order`)
                        }
                    }
                }
            });
        });
    }
});