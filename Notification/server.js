import app from "./src/app.js";
import { connectMQ } from "./src/broker/rabbit.js";
import config from "./src/configs/config.js";

const PORT = config.PORT;

connectMQ();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
