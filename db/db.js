const mongoose = require('mongoose');

async function dbConnect(){
    await mongoose.connect(process.env.MONGO_URI);
}

module.exports = dbConnect;