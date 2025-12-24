import 'ol/ol.css';
import './index.css'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default function createMap(target, options) {
  const map = new Map({
    target: target,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  });

  return map;
}