import app from "./src/app.js";
import config from "./src/configs/config.js";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
