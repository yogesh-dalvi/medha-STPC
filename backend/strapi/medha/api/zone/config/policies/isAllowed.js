"use strict";

/**
 * `isAllowed` policy.
 */
const bookshelf = require("../../../../config/config.js");
module.exports = async (ctx, next) => {
  const { role, zone } = ctx.state.user;
  const { id } = ctx.params;
  if (role.name === "Zonal Admin") {
    const data = await bookshelf
      .model("zone")
      .where({ id: id })
      .fetch();

    if (!data) {
      return ctx.response.notFound("Requested Zone does not exist");
    }

    if (!(data.id === zone)) {
      return ctx.response.unauthorized(
        "You don't have permission to access this information"
      );
    }
  }
  await next();
};
