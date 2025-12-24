// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`服务器运行在 http://${hostname}:${port}/`);
// });
// return false
const fs = require('fs');
const { Geometry, Feature, FeatureCollection } = require('geojson');
const { Geometry: OGRGeometry, Feature: OGRFeature, FieldDefn: OGRFieldDefn, FeatureDefn: OGRFeatureDefn, SpatialReference: OGRSpatialReference, CoordinateTransformation: OGRCoordinateTransformation, Point: OGRPoint } = require('osr');

function transform_XY(x, y, tf) {
    const jsonmarginX = tf.jsonmarginX || 0.0;
    const jsonmarginY = tf.jsonmarginY || 0.0;
    const jsonres = tf.jsonres || 1.0;
    const xpan = tf.xpan || 0.0;
    const ypan = tf.ypan || 0.0;
    const scale = tf.scale || 1.0;
    const xoffset = tf.xoffset || 0.0;
    const yoffset = tf.yoffset || 0.0;
    const rotation = tf.rotation;
    
    let tempx = ((x - jsonmarginX) / jsonres - xpan) / scale + xoffset;
    let tempy = ((y - jsonmarginY) / jsonres + ypan) / scale + yoffset;
 
    let outx, outy;
    if (rotation === undefined) {
        outx = tempx;
        outy = tempy;
    } else {
        const cosAngle = tf.cosAngle || Math.cos(rotation);
        const sinAngle = tf.sinAngle || Math.sin(rotation);
        outx = tempx * cosAngle + tempy * (-sinAngle);
        outy = tempx * sinAngle + tempy * cosAngle;
    }
    return { x: outx, y: outy };
}

const infile = "F:\\Protest\\Python\\genjsontopy\\ng-all.geo.json";
const data = fs.readFileSync(infile);
const gj = JSON.parse(data);

const hc_tfs = gj['hc-transform'];
const gsname = gj['title'];

const layer = gj.features[0];
const geotype = layer.geometry.type;

const spatialRef_WGS84 = new OGRSpatialReference();
spatialRef_WGS84.ImportFromEPSG(4326);

const outpath = "F:\\Protest\\Python\\genjsontopy\\";
const outfile = outpath + "\\" + gsname + ".geojson";
const data_out = new FeatureCollection();

for (const key in hc_tfs) {
    const spatialRef_Source = new OGRSpatialReference();
    spatialRef_Source.ImportFromProj4(hc_tfs[key].crs);
    hc_tfs[key].co_tf = new OGRCoordinateTransformation(spatialRef_Source, spatialRef_WGS84);
}

for (const feature of layer.features) {
    const fname = feature.properties.name;
    let mykey = 'default';
    if (fname) {
        for (const key in hc_tfs) {
            if (fname.toLowerCase().includes(key.toLowerCase())) {
                mykey = key;
                break;
            }
        }
    } else {
        break;
    }

    const geom = feature.geometry;
    for (const coord of geom.coordinates) {
        const { x, y } = transform_XY(coord[0], coord[1], hc_tfs[mykey]);
        coord[0] = x;
        coord[1] = y;
    }

    const ogrGeom = new OGRGeometry(geotype);
    ogrGeom.SetPoints(geom.coordinates);
    ogrGeom.Transform(hc_tfs[mykey].co_tf);

    const ogrFeature = new OGRFeature();
    ogrFeature.SetGeometry(ogrGeom);
    
    for (const key in feature.properties) {
        const value = feature.properties[key];
        const fieldDefn = new OGRFieldDefn(key);
        ogrFeature.SetField(fieldDefn, value);
    }

    data_out.features.push(ogrFeature);
}

fs.writeFileSync(outfile, JSON.stringify(data_out));
