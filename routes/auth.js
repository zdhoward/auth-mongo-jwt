const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//////// VALIDATION ////////
const { registerValidation, loginValidation } = require("../validation");

//////// POST ////////
router.post("/register", async (req, res) => {
    /// VALIDATION ///
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.status(400).json({ error: "Email already exists" });
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

router.post("/login", async (req, res) => {
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
        name: user.name,
        id: user._id
    },
        process.env.TOKEN_SECRET
    );

    res.header("auth-token", token).json({
        error: null,
        data: {
            token,
        },
    });
    console.log(user.name + " has logged in");
});

module.exports = router;