const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // adjust path if needed
const connectDB = require('../config/db'); // your DB connection utility

async function seedUsers() {
    await connectDB();

    console.log('🧹 Cleaning up Users...');
    await User.deleteMany({});
    console.log('✅ Cleared Users collection!');

    const users = [
        {
            username: 'noa',
            email: 'noa@example.com',
            password: '1234',
            allergies: [],
        },
        {
            username: 'ulyana',
            email: 'ulyana@example.com',
            password: 'password123',
            allergies: [],
        },
        {
            username: 'tester',
            email: 'tester@example.com',
            password: 'testmepls',
            allergies: [],
        },
    ];

    for (let user of users) {
        const newUser = await User.create(user);
        console.log(`👤 Created user: ${newUser.username}`);
    }

    await mongoose.disconnect();
    console.log('🎉 Done seeding users!');
}

seedUsers().catch(err => {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
});
