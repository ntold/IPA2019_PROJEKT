const express = require('express');
const router = express.Router();

const UserController = require('../controller/users')

router.post('/register', UserController.users_register_user)

router.post('/login', UserController.users_login_user)

router.get('/', checkAuth);

router.delete("/:id", checkAuth, function (req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) {
            return next(err)
        } else {
            res.json(post)
        }
    })
})

module.exports = router;
