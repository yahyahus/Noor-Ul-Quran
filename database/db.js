const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://ibrahimumair900:PAK%40zxc123@cluster0.dvaqrpv.mongodb.net/credentials');

// Define schemas
const AdminSchema = new mongoose.Schema
({

    username : String,
    password : String,

});


