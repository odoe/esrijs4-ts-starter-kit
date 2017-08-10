/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

import esriConfig = require("esri/config");

import { usersAsFeatureLayer } from "./serializers/users";
import Source from "./source";

import { users, webMapItem } from "../../config/main";

const { corsEnabledServers, url } = users;

corsEnabledServers.map((x: string) =>
  esriConfig.request.corsEnabledServers.push(x)
);

@subclass("app.sources.users")
class Users extends declared(Source) {
  constructor() {
    super();
    this.url = users.url;
  }

  serializer({ data }: any) {
    return { layer: usersAsFeatureLayer(data) };
  }
}

export default Users;
