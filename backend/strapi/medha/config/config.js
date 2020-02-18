const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: "5432",
    user: "medha",
    password: "medha",
    database: "medha"
  }
});

const bookshelf = require("bookshelf")(knex);

/**
 * Registering models for bookshelf
 */
bookshelf.model("state", {
  tableName: "states"
});

bookshelf.model("zone", {
  tableName: "zones"
});

bookshelf.model("rpc", {
  tableName: "rpcs"
});

bookshelf.model("college", {
  tableName: "colleges"
});

bookshelf.model("stream", {
  tableName: "streams"
});

bookshelf.model("education", {
  tableName: "educations"
});

bookshelf.model("role", {
  tableName: "users-permissions_role"
});

bookshelf.model("permission", {
  tableName: "users-permissions_permission"
});

bookshelf.model("user", {
  tableName: "users-permissions_user",
  state() {
    return this.belongsTo("state", "state", "id");
  },
  zone() {
    return this.belongsTo("zone", "zone", "id");
  },
  rpc() {
    return this.belongsTo("rpc", "rpc", "id");
  },
  college() {
    return this.belongsTo("college", "college", "id");
  }
});

bookshelf.model("student", {
  tableName: "students",
  user() {
    return this.belongsTo("user", "user", "id");
  },
  stream() {
    return this.belongsTo("stream", "Stream", "id");
  },
  educations() {
    return this.hasMany("education", "student", "id");
  }
});

module.exports = bookshelf;
