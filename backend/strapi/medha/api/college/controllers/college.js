"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
module.exports = {
  async find(ctx) {
    const { id, role, rpc, zone, college } = ctx.state.user;
    console.log(zone);
    if (role.name === "Medha Admin" || role.name === "Admin") {
      const result = await bookshelf.model("college").fetchAll({
        withRelated: ["streams", "principal", "admins", "rpc"]
      });
      console.log(result);
      ctx.body = result;
    }

    if (role.name === "Zonal Admin") {
      const result = await bookshelf.model("college").fetchAll({
        require: false,
        withRelated: [
          "streams",
          "principal",
          "admins",
          "rpc",
          {
            rpc: query => {
              query.where({
                zone: zone
              });
            }
          }
        ]
      });
      console.log(result);
      const data = result.toJSON();
      // const response = data
      //   .map(obj => {
      //     if (Object.keys(obj.rpc).length) {
      //       return obj;
      //     }
      //   })
      //   .filter(a => a);

      const response = data.reduce((accumulator, obj) => {
        if (Object.keys(obj.rpc).length) {
          accumulator.push(obj);
        }
        return accumulator;
      }, []);

      // console.log(result);
      ctx.body = response;
    }

    if (role.name === "RPC Admin") {
      const result = await bookshelf
        .model("college")
        .where({ rpc: rpc })
        .fetchAll({ withRelated: ["streams", "principal", "admins"] });
      console.log(result);
      ctx.body = result;
    }

    if (role.name === "College Admin") {
      const result = await bookshelf
        .model("college")
        .where({ id: college })
        .fetchAll({ withRelated: ["streams", "principal", "admins"] });

      console.log(result);
      ctx.body = result;
    }
  },

  async showStudents(ctx) {
    const { id } = ctx.params;
    const { role } = ctx.state.user;

    const result = await bookshelf.model("student").fetchAll({
      withRelated: [
        "user.college",
        "stream",
        "educations",
        {
          user: query => {
            query.where({ college: id });
          }
        }
      ]
    });
    const data = result.toJSON();
    const response = data.reduce((accumulator, obj) => {
      if (Object.keys(obj.user).length) {
        accumulator.push(obj);
      }
      return accumulator;
    }, []);
    console.log(response);
    ctx.body = response;
  }
};
