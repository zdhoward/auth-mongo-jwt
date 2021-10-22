const router = require("express").Router();

//////// INDEX ////////
router.get("/", (req, res) => {
    //res.send('DEBUG');
    if (req.session.user) {
        res.render('index', { user: req.session.user.name, info: req.session.user.email });
    } else {
        res.render('index');
    }
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
    req.session.user = {
        uuid: '1111-11111111-1111',
        name: 'FULL NAME',
        email: 'test@test.com'
    }
    req.session.save(err => {
        if (err) {
            console.log(err);
        } else {
            //res.send(req.session.user); // this returns json
            res.redirect("/debug");
        }
    });
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
    res.send("AUTH REQUIRED");
});

module.exports = router;