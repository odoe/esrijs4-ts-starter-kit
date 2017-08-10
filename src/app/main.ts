import MapView = require("esri/views/MapView");
import watchUtils = require("esri/core/watchUtils");

import store from "./stores/app";

const { whenTrueOnce } = watchUtils;

const empty = (element: Element) => (element.innerHTML = "");

const start = () => {
  store.loadWidgets();
  const viewDiv = document.querySelector("webmap") as HTMLDivElement;
  if (viewDiv) {
    empty(viewDiv);
  }
  whenTrueOnce(store, "signedIn")
    .then(() => {
      const mapView = new MapView({ map: store.webmap, container: viewDiv });
      store.view = mapView;
      return store.view;
    })
    .then(() => store.fetchUsers())
    .then(({ layer }: any) => {
      store.addLayer(layer);
    });
};

export = { start };
