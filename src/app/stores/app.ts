/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import Accessor = require("esri/core/Accessor");
import Credential = require("esri/identity/Credential");
import FeatureLayer = require("esri/layers/FeatureLayer");
import promiseUtils = require("esri/core/promiseUtils");
import watchUtils = require("esri/core/watchUtils");

// Widgets

import Compass = require("esri/widgets/Compass");
import Home = require("esri/widgets/Home");
import Legend = require("esri/widgets/Legend");
import Search = require("esri/widgets/Search");
import Expand = require("esri/widgets/Expand");

import Authenticate = require("./../widgets/Authenticate");

import {
  aliasOf,
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

import Users from "../sources/users";

import { appId, webMapItem } from "../../config/main";

interface Store {
  webmap: WebMap;
  view: MapView;
}

const { watch, whenOnce } = watchUtils;

const element = () => document.createElement("div");

@subclass("app.stores.app")
class AppStore extends declared(Accessor) implements Store {
  @property() minimal = false;

  @property({ readOnly: true })
  webmap: WebMap = new WebMap(webMapItem);

  @property() signedIn = false;

  @property() view: MapView;

  @property() userSource: Users = new Users();

  @property() userLayer: FeatureLayer;

  @aliasOf("webmap.add") addLayer: (layer: __esri.Layer) => void;

  @aliasOf("view.ui.add") addToUI: (components: any) => void;

  fetchUsers() {
    return this.userLayer
      ? promiseUtils.resolve({ layer: this.userLayer })
      : this.userSource.fetch();
  }

  loadWidgets() {
    const authNode = document.querySelector("authentication") || element();
    const login = new Authenticate({
      appId,
      container: authNode
    });

    watch(login, "credential", credential => {
      this.signedIn = !!credential;
    });

    whenOnce(this, "view")
      .then(({ value: view }) => {
        login.view = view;

        const legend = new Legend({
          container: element(),
          view
        });
        const search = new Search({
          container: element(),
          view
        });

        return [
          {
            component: new Home({
              container: element(),
              view
            }),
            position: "top-left"
          },
          {
            component: new Compass({
              container: element(),
              view
            }),
            position: "top-left"
          },
          {
            component: new Expand({
              content: (search as any).domNode,
              expandIconClass: "esri-icon-search",
              view
            }),
            position: "top-right"
          },
          {
            component: new Expand({
              content: (legend as any).domNode,
              expandIconClass: "esri-icon-layers",
              view
            }),
            position: "top-right"
          }
        ];
      })
      .then(widgets => {
        this.addToUI(widgets);
      });
  }
}

export default new AppStore();
