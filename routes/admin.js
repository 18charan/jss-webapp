const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.cookies.admin)
        res.redirect('/admin/dashboard');
    else
        res.render('admin_login');
});

router.post('/', (req, res) => {
    if (req.body.password == process.env.ADMIN_PASSWORD) {
        res.cookie('admin', true);
        res.redirect('/admin/dashboard');
    } else
        res.render('admin_login', {
            message: "Wrong password"
        });
});

router.get('/dashboard', (req, res) => {
    if (req.cookies.admin)
        res.render('admin_dashboard');
    else
        res.redirect('/admin/');
});

router.get('/logout', (req, res) => {
    res.clearCookie('admin');
    res.redirect('/');
});

module.exports = router;