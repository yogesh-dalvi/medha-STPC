const fs = require("fs");
const bookshelf = require("./config/config.js");
const apiFolder = "./api/";
const roles = require("./roles.json");

let controllerActionWithoutUser = fs
  .readdirSync(apiFolder, { withFileTypes: true })
  .filter(api => api.isDirectory())
  .reduce((acc, folder) => {
    const { name } = folder;
    const raw = fs.readFileSync(`./api/${name}/config/routes.json`);
    const route = JSON.parse(raw);
    const actionObj = route.routes.reduce((result, r) => {
      const action = r.handler.split(".")[1].toLowerCase();
      result[action] = { enabled: false };
      return result;
    }, {});
    acc[name] = actionObj;
    return acc;
  }, {});

const allControllerActions = Object.assign(controllerActionWithoutUser, {
  user: {
    find: { enabled: false },
    count: { enabled: false },
    findone: { enabled: false },
    create: { enabled: false },
    update: { enabled: false },
    delete: { enabled: false },
    me: { enabled: false }
  }
});

const data = Object.keys(roles).map(r => {
  const { controllers, grantAllPermissions } = roles[r];
  const updatedController = controllers.reduce((result, controller) => {
    const { name, action } = controller;
    if (grantAllPermissions) {
      const controllerWithAction = allControllerActions[name];
      const updatedActions = Object.keys(controllerWithAction).reduce(
        (acc, a) => {
          acc[a] = { enabled: true };
          return acc;
        },
        {}
      );

      result[name] = updatedActions;
      return result;
    } else {
      const controllerWithAction = allControllerActions[name];
      let updatedActions;
      if (action.length) {
        updatedActions = Object.keys(controllerWithAction).reduce((acc, a) => {
          acc[a] = { enabled: action.includes(a) };
          return acc;
        }, {});
      } else {
        updatedActions = Object.keys(controllerWithAction).reduce((acc, a) => {
          acc[a] = { enabled: false };
          return acc;
        }, {});
      }

      result[name] = updatedActions;
      return result;
    }
  }, {});

  return {
    name: r,
    description: r,
    permissions: {
      application: {
        controllers: updatedController
      }
    }
  };
});

function addPermissionsToGivenRole(role, id) {
  /**
   * Creating permissions WRT to controllers and mapping to created role
   */
  Object.keys(role.permissions || {}).forEach(type => {
    Object.keys(role.permissions[type].controllers).forEach(controller => {
      console.log(`Adding permission for ${controller} for role ${role.name}`);
      Object.keys(role.permissions[type].controllers[controller]).forEach(
        action => {
          bookshelf
            .model("permission")
            .forge({
              role: id,
              type: controller === "user" ? "users-permissions" : type,
              controller: controller,
              action: action.toLowerCase(),
              ...role.permissions[type].controllers[controller][action]
            })
            .save();
        }
      );
    });
    console.log("\n");
  });
}

data.forEach(role => {
  bookshelf
    .model("role")
    .fetchAll()
    .then(model => {
      const response = model.toJSON();
      const isRolePresent = response.find(r => r.name === role.name);
      if (isRolePresent) {
        bookshelf
          .model("permission")
          .where({ role: isRolePresent.id })
          .destroy()
          .then(() => {
            console.log(
              `Deleting existing permissions for role ${isRolePresent.name}\nAdding new permissions\n`
            );
            addPermissionsToGivenRole(role, isRolePresent.id);
          });
      } else {
        // Creating role
        bookshelf
          .model("role")
          .forge({
            name: role.name,
            description: role.description,
            type: role.name
          })
          .save()
          .then(r => {
            const _role = r.toJSON();
            addPermissionsToGivenRole(role, _role.id);
          })
          .catch(error => {
            console.log(error);
          });
      }
    })
    .catch(failed => {
      console.log({ failed });
    });
});
