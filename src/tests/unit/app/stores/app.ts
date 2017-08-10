import { assert } from "chai";
import * as registerSuite from "intern/lib/interfaces/object";
import { mock, SinonSpy, spy, stub } from "sinon";
import promiseUtils = require("esri/core/promiseUtils");

import store from "../../../../app/stores/app";
import esriRequest = require("esri/request");
import FeatureLayer = require("esri/layers/FeatureLayer");

registerSuite({
  name: "app/stores/app",
  setup() {},
  beforeEach() {
    store.userLayer = null;
  },
  afterEach() {},
  teardown() {},

  "will retrieve a user layer when available": async () => {
    store.userLayer = new FeatureLayer({ id: "awesome" });
    const userSource = stub(store, "userSource");
    const { layer } = await store.fetchUsers();
    userSource.restore();
    assert.equal(layer.id, "awesome");
  },

  "will fetch a user layer when not readily available": async () => {
    const userLayer = new FeatureLayer({ id: "awesome" });
    const userSource = stub(store.userSource, "fetch").resolves(
      promiseUtils.resolve({ layer: userLayer })
    );
    const { layer } = await store.fetchUsers();
    assert.ok(userSource.called);
    userSource.restore();
    assert.equal(layer.id, "awesome");
  }
});
