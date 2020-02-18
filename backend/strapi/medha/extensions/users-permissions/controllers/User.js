"use strict";

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] }
];

const bookshelf = require("../../../config/config.js");
module.exports = {
  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] }
      ]);
    }

    let data;
    await bookshelf
      .model("user")
      .where({ id: user.id })
      .fetch({ withRelated: ["state", "zone", "rpc", "college"] })
      .then(u => {
        data = sanitizeUser(u);
      });

    ctx.send(data);
  }
};
