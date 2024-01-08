const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserController');
const { verifyToken } = require('../hooks/middleware');

router.route('/register')
  .post(controller.userRegister);

router.route('/login')
  .get(controller.userLog)
  .post(controller.userLogin);

router.route('/logout')
  .get(controller.userLogout);

router.route('/delete')
  .post(controller.userDelete);

router.route('/isAuth')
  .all(verifyToken)
  .get(controller.userIsAuth);

module.exports = router;