const express = require('express');
const userController = require('../controllers/userController');
const { verifyUserToken, AuthorizeUser } = require('../middleware/auth');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const NotFoundItemException = require('../utils/NotFoundItemError');
const router = express.Router();




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/:userId',verifyUserToken, AuthorizeUser,catchAsync(async(req, res,next)=>
{
  const userId = req.params.userId;
  console.log(userId);
  const user = await userModel.findById(userId);
  if (!user) throw new NotFoundItemException(userId);

  res.json({"user": {"name": user.name, 'email': user.email}});

}));

router.delete('/:userId',userController.deleteUser);


/* router.post(
  "/register",
  catchAsync(async (req, res) => {
    const { name, email, password } = req.body.user;
    console.log(req.body.user);
    if (!name || !email || !password) {
      return res.json({ message: "Please enter all the details" });
    }
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      return res.json({ message: "User already exist with the given email" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.user.password, salt);
    req.body.user.password = hashPassword;
    const user = new userModel(req.body.user);
    await user.save();
    console.log(`user: ${user}`);
    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return res
      .cookie({ token: token })
      .json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
  })
);  */

/* router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body.user;
    if (!email || !password) {
      return res.json({ message: "Please enter all the details" });
    }

    const userExist = await userModel.findOne({ email: email });
    if (!userExist) {
      return res.json({ message: "Wrong credentials" });
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordMatched) {
      return res.json({ message: "Wrong credentials - password" });
    }
    const token = await jwt.sign(
      { id: userExist._id, name:userExist.name, email:userExist.email},
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    return res.header({ token: token })
      .cookie({ token: token })
      .json({ success: true, message: "LoggedIn Successfully" });
  } catch (error) {
    return res.json({ error: error });
  }
});  */


module.exports = router;
