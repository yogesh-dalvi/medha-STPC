"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
module.exports = {
  async find(ctx) {
    const user = ctx.state.user;
    const result = await bookshelf.model("college").fetchAll({
      withRelated: ["streams", "principal", "admins"]
    });

    ctx.send(result.toJSON());
  }
};
