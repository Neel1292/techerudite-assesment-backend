const router = require('express').Router();
const { handleCreateNewUser, handleLoginUser, handleVerifyUser } = require('../controller/authController');

router.post('/register', handleCreateNewUser);
router.post('/login', handleLoginUser);
router.patch('/verify', handleVerifyUser);

module.exports = router