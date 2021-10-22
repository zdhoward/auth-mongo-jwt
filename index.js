//////// MODULES ////////
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' })

const session = require('express-session');
const MongoStore = require('connect-mongo');
const crypto = require("crypto");

//////// EXTEND EXPRESS REQUESTS ////////
const jwt = require("jsonwebtoken");
express.request.helloworld = function () {
    console.log("HELLO WORLD");
};

express.request.isAuthenticated = function () {
    if (this.session.token) {
        //console.log(req.session.token);
        return !!jwt.verify(this.session.token, process.env.TOKEN_SECRET);
        //onsole.log(decoded);
    }
};

express.request.getTokenData = function () {
    if (this.session.token) {
        return jwt.verify(this.session.token, process.env.TOKEN_SECRET);
    } else {
        return {};
    }
};

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
app.set('view engine', 'ejs');

//////// IMPORT ROUTES ////////
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const verifyToken = require("./routes/validate-token");

const debugRoutes = require("./routes/debug");

//////// SESSIONS ////////
app.use(session({
    genid: (req) => { return crypto.randomUUID(); },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECT,
        mongooseConnection: mongoose.connection,
        ttl: 30 * 60 * 60, // save session for 30 hrs
        autoRemove: 'native'
    }),
}));

//////// MIDDLEWARES ////////
app.use(express.json()); // for body parser
app.use(express.urlencoded({ extended: true }));

//////// ROUTE MIDDLEWARES ////////
app.use("/api/user", authRoutes);
app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/debug", debugRoutes);

//////// POST ////////


//////// SERVER LISTEN ////////
app.listen(3000, () => console.log("Server is listening on localhost:3000"));