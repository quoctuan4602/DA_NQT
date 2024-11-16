const film = require("./Film");
const user = require("./User");
const Comment = require("./Comment");
const actor = require("./Actor");
const type = require("./Type");
const notification = require("./Notify");

const routes = (app) => {
  app.use("/films", film.router);
  app.use("/users/", user);
  app.use("/comments/", Comment);
  app.use("/actors/", actor);
  app.use("/types/", type);
  app.use("/notification/", notification);
};

module.exports = routes;
