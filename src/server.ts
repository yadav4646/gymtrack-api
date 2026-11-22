import { app } from "./app.js";
import { logger } from "./lib/logger.js";

app.listen(3000, () => {
    logger.info("Server is running");
});
