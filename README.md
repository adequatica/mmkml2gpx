# Maps.me KML to GPX converter

After [maps.me](https://maps.me) update 2.0 in December 2020 the app was ruined by the new owner and became completely unusable. The only way to continue using your bookmarks freely is to migrate to another app.

Placemark's style in KML format is not transferable to GPX format in regular converters like [GPSBabel](https://www.gpsbabel.org) or [MyGeodata](https://mygeodata.cloud/converter/kml-to-gpx).

This converter transfer color of maps.me styles to similar representations in [Guru Maps](https://gurumaps.app) and [OsmAnd](https://osmand.net). This converter works only with placemarks and does not support tracks convertion.

### How it works

1. If you have KMZ files (default maps.me export filetype) you need to convert them into KML:
    - Change filetype from .KMZ to .ZIP
    - Unzip file and you will get .KML
2. Put .KML files into /KML folder in the current repository
3. Run: `npm run convert`
4. Get converted .GPX files from /GPX folder:
    - This files could be imported to [Guru Maps](https://gurumaps.app), [OsmAnd](https://osmand.net) or [Pocket Earth](https://pocketearth.com).
