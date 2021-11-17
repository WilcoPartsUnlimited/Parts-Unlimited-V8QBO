const { internet, name, random, lorem, datatype, image } = require("faker");
const mongoose = require("mongoose");

const BROKEN_IMAGE = 'http://www.domain.com/MyImages/battleship-game-board.jpg';

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
    require('../models/Comment');
};

const populateUsers = async (count = 120) => {
    const users = [];

    for (let i = 0; i < count; i++) {
        const user = buildRandomUser();

        users.push(await user.save());
    }

    return users;
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

const populateItems = async (count = 120, users, comments) => {
    for (let i = 0; i < count; i++) {
        const randomUser = random.arrayElement(users);
        const randomComment = random.arrayElement(comments);
        const item = buildRandomItem(randomUser, randomComment);

        await item.save();
    }
}

const buildRandomItem = (seller, comment) => {
    const Item = mongoose.model("Item");

    const item = new Item();

    item.slug = lorem.slug();
    item.title = lorem.word();
    item.description = lorem.sentence();
    item.image = datatype.number(10) <= 2 ? BROKEN_IMAGE : image.sports();
    item.seller = seller.id;
    item.comments = [comment.id];

    return item;
}

const populateComments = async (count = 120) => {
    const comments = [];

    for (let i = 0; i < count; i++) {
        const comment = buildRandomComment();

        comments.push(await comment.save());
    }

    return comments;
}

const buildRandomComment = () => {
    const Comment = mongoose.model("Comment");

    const comment = new Comment();

    comment.body = lorem.sentence();

    return comment;
}


const run = async () => {
    connectedToDatabase();
    requireModels();
    const users = await populateUsers();
    const comments = await populateComments();
    await populateItems(130, users, comments);
}

run().then(() => {
    console.log("Finished populating database!");
    process.exit(0);
});

