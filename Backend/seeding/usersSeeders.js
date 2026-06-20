require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const users = [
    {
        username: "noha4",
        email: "noha7@test.com",
        password: "123456"
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017");

        // clear old data
        // await User.deleteMany();

        // insert users
        await User.insertMany(users);

        console.log("🌱 Users seeded successfully");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();