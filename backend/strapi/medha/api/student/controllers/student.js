"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Retrieve authenticated student.
   * @return {Object}
   */
  async me(ctx) {
    const user = ctx.state.user;
    let data;
    await bookshelf
      .model("student")
      .where({ user: user.id })
      .fetch({
        withRelated: [
          "user.state",
          "user.zone",
          "user.rpc",
          "user.college",
          "stream",
          "educations"
        ]
      })
      .then(u => {
        data = sanitizeEntity(u, {
          model: strapi.query("student").model
        });
      });

    ctx.send(data);
  }
};
