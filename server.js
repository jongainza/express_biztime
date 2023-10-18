/** Server startup for BizTime. */

const app = require("./app");

try {
  app.listen(3000, function () {
    console.log("Listening on 3000");
  });
} catch (e) {
  console.error("Server startup error: " + error.message);
}
