const router = require("express").Router();

//////// INDEX ////////
router.get("/", (req, res) => {
    //res.send('DEBUG');
    res.render('index', { user: 'Zach', info: 'random info' });
});

//////// REGISTER ////////
router.get("/register", (req, res) => {
    res.render('register', {});
});

router.post("/register", (req, res) => {
    console.log('PROCESSING LOGIN');
});

//////// LOGIN ////////
router.get("/login", (req, res) => {
    //res.send('LOGIN');
    res.render('login', {});
});

router.post("/login", (req, res) => {
    console.log('PROCESSING LOGIN');
});

//////// LOGOUT ////////
router.get("/logout", (req, res) => {
    res.send('LOGOUT');
});

router.post("/logout", (req, res) => {
    console.log('PROCESSING LOGOUT');
});

//////// AUTHREQ ////////
router.get("/authreq", (req, res) => {
    res.send("AUTH REQUIRED");
});

module.exports = router;