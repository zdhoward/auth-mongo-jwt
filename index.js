//////// MODULES ////////
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' })

//////// CONNECT DB ////////
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log("Connected to DB")
);

//////// CREATE APP ////////
const app = express();

//////// IMPORT ROUTES ////////
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const verifyToken = require("./routes/validate-token");

//////// MIDDLEWARES ////////
app.use(express.json()); // for body parser

//////// ROUTE MIDDLEWARES ////////
app.use("/api/user", authRoutes);
app.use("/api/dashboard", verifyToken, dashboardRoutes);

//////// POST ////////


//////// SERVER LISTEN ////////
app.listen(3000, () => console.log("Server is listening on localhost:3000"));