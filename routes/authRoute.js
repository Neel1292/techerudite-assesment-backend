const router = require('express').Router();
const { handleCreateNewUser, handleLoginUser, handleVerifyUser, handleVerifyToken } = require('../controller/authController');

router.post('/register', handleCreateNewUser);
router.post('/login', handleLoginUser);
router.get('/verify', handleVerifyToken);
router.patch('/verify', handleVerifyUser);

module.exports = router