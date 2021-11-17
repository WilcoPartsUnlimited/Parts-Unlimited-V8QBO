const { internet, name } = require("faker");
const mongoose = require("mongoose");

const connectedToDatabase = () => {
    if (!process.env.MONGODB_URI) {
        console.warn("Missing MONGODB_URI in env, please add it to your .env file");
    }

    mongoose.connect(process.env.MONGODB_URI);
    mongoose.set("debug", true);
}

const requireModels = () => {
    require('../models/User');
};

const populateUsers = async (count = 10) => {
    for (let i = 0; i < count; i++) {
        const user = buildRandomUser();

        await user.save();
    }
}

const buildRandomUser = () => {
    const User = mongoose.model("User");

    const user = new User();

    user.username = name.firstName();
    user.email = internet.email();
    user.setPassword(internet.password());

    return user;
}

const run = async () => {
    connectedToDatabase();
    requireModels();
    await populateUsers();
}

run().then(() => {
    console.log("Finished populating database!");
    process.exit(0);
});

