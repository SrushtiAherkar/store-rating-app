import { sequelize } from "./config/db.js";
import { User } from "./models/User.js";
import { Store } from "./models/Store.js";
import { Rating } from "./models/Rating.js";

const reset = async () => {
    try {
        console.log("Reseting database...");
        // force: true drops tables if they exist
        await sequelize.sync({ force: true });
        console.log("Database reset successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error resetting database:", err);
        process.exit(1);
    }
};

reset();
