import app from "./src/app.js";
import "./src/config/db.config.js";

const port = process.env.PORT || 4002;

const server = app.listen(port, () => {
  console.log(`🚀 Password Manager Server listening on http://localhost:${port}`);
});

export default server;
