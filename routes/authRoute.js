const router = require('express').Router();
const { handleCreateNewUser, handleLoginUser } = require('../controller/authController');

router.post('/register', handleCreateNewUser);
router.post('/login', handleLoginUser);
// router.post('/verify-email', handleCreateNewUser);

module.exports = router