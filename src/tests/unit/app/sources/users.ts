import { assert } from "chai";
import * as registerSuite from "intern/lib/interfaces/object";
import { mock, SinonSpy, spy, stub } from "sinon";
import promiseUtils = require("esri/core/promiseUtils");

import Users from "../../../../app/sources/users";
import esriRequest = require("esri/request");

const users = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: { lat: -37.3159, lng: 81.1496 }
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets"
    }
  }
];

registerSuite({
  name: "app/sources/users",
  setup() {},
  beforeEach() {},
  afterEach() {},
  teardown() {},

  "user source can serialize to user featurelayer"() {
    const usersSource = new Users();
    const { layer } = usersSource.serializer({ data: users });

    const user = users[0];
    const { source } = layer;
    const { attributes } = source.getItemAt(0);

    const { street, city, zipcode } = user.address;

    assert.equal(attributes.ObjectID, user.id);
    assert.equal(attributes.name, user.name);
    assert.equal(attributes.email, user.email);
    assert.equal(attributes.companyName, user.company.name);
    assert.equal(attributes.address, `${street}, ${city}, ${zipcode}`);
  }
});
