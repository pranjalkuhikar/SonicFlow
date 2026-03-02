import app from "./src/app.js";
import config from "./src/configs/config.js";
import connectDB from "./src/db/db.js";

const PORT = config.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
