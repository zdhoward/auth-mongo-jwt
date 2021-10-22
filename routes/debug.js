const router = require("express").Router();

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require("../validation");
const User = require("../model/User");


//////// PASSPORT ////////
/*
const passport = require('passport');
const JWTStrategy = require('passport-jwt');

const JWTConfig = {
    jwtSecret: process.env.TOKEN_SECRET,
    jwtSession: { session: false },
}
*/

//////// INDEX ////////
router.get("/", (req, res) => {
    //res.send('DEBUG');
    const tokenData = req.getTokenData();
    if (req.isAuthenticated()) {
        res.render('index', { user: tokenData.name, info: tokenData.email });
    } else {
        res.render('index');
    }
});

//////// REGISTER ////////
router.get("/register", (req, res) => {
    res.render('register', {});
});

router.post("/register", async (req, res) => {
    console.log('PROCESSING REGISTRATION');
    console.log(req.body);

    /// VALIDATION ///
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.status(400).json({ error: "Email already exists" });
    }

    if (req.body.password != req.body.confirmPassword) {
        return res.status(400).json({ error: "Confirm Password does not match Password" });
    }

    /// SECURE PASSWORD ///
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    /// CONSTRUCT A NEW USER ///
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password, //hashed pass
    });

    try {
        const savedUser = await user.save();
        res.json({ error: null, data: { userId: savedUser._id } });
        console.log('REGISTERED NEW USER: ' + req.body.name);
    } catch (error) {
        res.status(400).json({ error });
        console.log('FAILED TO REGISTER NEW USER: ' + req.body.name);
    }
});

//////// LOGIN 2 ////////
router.get("/login", (req, res) => {
    //res.send('LOGIN');
    res.render('login', {});
});

router.post("/login", async (req, res) => {
    console.log(req.body);
    /// VALIDATE USER ///
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ error: "Email is wrong" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: "Password is wrong" });
    }

    /// CREATE TOKEN ///
    const token = jwt.sign({
        // PAYLOAD DATA // Sent back to user
        id: user._id,
        name: user.name,
        email: user.email,
    },
        process.env.TOKEN_SECRET
    );

    req.session.token = token;

    req.session.save(err => {
        if (err) {
            console.log(err);
        } else {
            //res.send(req.session.user); // this returns json
            res.redirect("/debug");
        }
    });

    console.log(user.name + " has logged in");
});

//////// LOGOUT ////////
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            //res.send('Session is destroyed')
            //res.send('LOGGED OUT, SESSION DESTROYED');
        }
    }); //THIS DESTROYS THE SESSION.
    res.redirect('/debug');
});

//////// AUTHREQ ////////
router.get("/authreq", (req, res) => {
    if (req.isAuthenticated()) {
        res.send("ACCESS PERMITTED");
    } else {
        res.redirect('/debug');
    }

});

router.get("/sessiondump", (req, res) => {
    //console.log(req.isAuthenticated());
    res.send(req.session);
});


module.exports = router;