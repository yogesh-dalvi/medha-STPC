"use strict";

/**
 * `validate` policy.
 */

module.exports = async (ctx, next) => {
  const { name } = ctx.request.body;
  if (!name) {
    return ctx.response.badRequest("Name field is missing");
  }
  await next();
};
