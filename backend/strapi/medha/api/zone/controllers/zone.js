"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const bookshelf = require("../../../config/config.js");
module.exports = {
  /**
   * Retrieve Zones.
   * Depending on user's role appropriate Zones will be returned
   * medha-admin/ admin will get all available Zones
   * zonal-admin will get his zone
   * @return {Array}
   */
  async find(ctx) {
    const { role, zone } = ctx.state.user;
    let data;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      const result = await bookshelf
        .model("zone")
        .fetchAll({ withRelated: ["state"] });
      data = result;
    }

    if (role.name === "Zonal Admin") {
      const result = await bookshelf
        .model("zone")
        .where({
          id: zone
        })
        .fetchAll({ withRelated: ["state"] });
      data = result;
    }

    ctx.send(data);
  },

  /**
   * Retrieve all rpcs under zone
   * @return {Object}
   */
  async rpcs(ctx) {
    const { id } = ctx.params;
    return bookshelf
      .model("zone")
      .where({
        id: id
      })
      .fetch({ withRelated: ["rpcs"] });
  },

  /**
   * Retrieve all colleges under zone
   * @return {Object}
   */
  async colleges(ctx) {
    const { id } = ctx.params;
    return bookshelf
      .model("zone")
      .where({
        id: id
      })
      .fetch({ withRelated: ["rpcs.colleges", "rpcs.colleges.rpc"] })
      .then(res => {
        const data = res.toJSON();
        let colleges = data.rpcs.reduce((acc, rpc) => {
          acc.push(...rpc.colleges);
          return acc;
        }, []);
        delete data.rpcs;
        data.colleges = colleges;
        return data;
      });
  }
};
