const router = require('express').Router();
const { handleCreateNewUser } = require('../controller/authController');

router.post('/register', handleCreateNewUser);

module.exports = router