var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const { verifyUserToken, IsUser, IsAdmin, AuthorizeUser } = require('../middleware/auth');
const { validateUser } = require('../middleware/middelwares');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// register new user
router.post('/register',validateUser, userController.register);
// login user in
router.post('/login', userController.login);

router.get('/regular/:id', verifyUserToken, AuthorizeUser, (req, res)=>
{
  res.json({message:"Regular"});
});


/* router.get('/special',verifyUserToken, IsAdmin, (req, res)=>
{
  res.json({message:"Special"});
});
 */
module.exports = router;

