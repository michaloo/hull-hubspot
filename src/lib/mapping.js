import _ from "lodash";

export default class Mapping {
  constructor(ship) {
    this.ship = ship;

    this.map = [
        { name: "email", hull: "email", type: "string", title: "Email" },
        { name: "salutation", hull: "hubspot/salutation", type: "string", title: "Salutation" },
        { name: "firstname", hull: "hubspot/first_name", type: "string", title: "First Name" },
        { name: "lastname", hull: "hubspot/last_name", type: "string", title: "Last Name" },
        { name: "phone", hull: "hubspot/phone", type: "string", title: "Phone Number" }
    ];
  }

  /**
   * Returns the Hubspot properties names.
   * When doing a sync we need to download only those
   * @return {Array}
   */
  getHubspotPropertiesKeys() {
    return this.map.map((prop) => prop.name);
  }

  /**
   * Returns the Hull traits names.
   * Useful when doing request extract calls
   * @return {Array}
   */
  getHullTraitsKeys() {
    return this.map.map((prop) => prop.hull);
  }


  /**
   * Maps Hubspot contact properties to Hull traits
   * @param  {Object} userData Hubspot contact
   * @return {Object}          Hull user traits
   */
  getHullTraits(userData) {
    const hullTraits = _.reduce(this.map, (traits, prop) => {
      traits[prop.hull] = _.get(userData, `properties[${prop.name}].value`);
      return traits;
    }, {});

    hullTraits.fetched_at = new Date();

    return hullTraits;
  }

  /**
   * Maps Hull user data to Hubspot contact properties
   * @see http://developers.hubspot.com/docs/methods/contacts/update_contact
   * @param  {Object} userData Hull user object
   * @return {Array}           Hubspot properties array
   */
  getHubspotProperties(userData) {
    return _.reduce(this.map, (props, prop) => {
      const value = _.get(userData, prop.hull);
      if (value) {
        props.push({
          property: prop.name,
          value
        });
      }
      return props;
    }, []);
  }
}
