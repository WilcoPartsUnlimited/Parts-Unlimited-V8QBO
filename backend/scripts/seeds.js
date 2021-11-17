const { internet, name, random, lorem } = require("faker");
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
    require('../models/Item');
};

const populateUsers = async (count = 120) => {
    for (let i = 0; i < count; i++) {
        const user = buildRandomUser();

        await user.save();
    }
}

const buildRandomUser = () => {
    const User = mongoose.model("User");

    const user = new User();

    const firstName = name.firstName().replace(' ', '').replace('\'', '');
    user.username = `${firstName}${random.number()}`;
    user.email = internet.email();
    user.setPassword(internet.password());

    return user;
}

const populateItems = async (count = 120) => {
    for (let i = 0; i < count; i++) {
        const item = buildRandomItem();

        await item.save();
    }
}

const buildRandomItem = () => {
    const Item = mongoose.model("Item");

    const item = new Item();

    item.slug = `${lorem.slug()}`;

    return item;
}

const run = async () => {
    connectedToDatabase();
    requireModels();
    await populateUsers();
    await populateItems();
}

run().then(() => {
    console.log("Finished populating database!");
    process.exit(0);
});

