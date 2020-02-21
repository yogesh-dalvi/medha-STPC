'use strict';

/**
 * `validate` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log('In validate policy.');

  await next();
};
