const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Expense = require("../models/Expense");
const { FindCategoryIdByName } = require("../services/CategoryService");



exports.register = catchAsync(async (req, res) => {
  
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.user.password, salt);

  // create an user
  const { email, name, password, user_type_id } = req.body.user;

  let user = new User({
    email: email,
    name: name,
    password: hashPassword,
    user_type_id: user_type_id,
  });
  
  const savedUser = await user.save();

  let payload = { id: savedUser._id };

  const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE});
  
  
  res.status(201).cookie({ token: token }).json({ token });
});

exports.login = catchAsync(async (req, res) => {

  console.log(req.body.user);
  const user = await User.findOne({ email: req.body.user.email });
  if (user) {
    const validPassword = await bcrypt.compare(
      req.body.user.password, user.password
    );
    console.log(await bcrypt.compare(
      req.body.user.password, user.password
    ));
  
    if (!validPassword) {
      return res.status(401).json("Email or Password is wrong");
    }

    let payload = { id: user._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE});

    res.status(200).header("auth-token", token).cookie({token: token}).json({ message: `Welcome back ${user.name}`, token: token });

  } 
  else {
    res.status(401).json("Invalid email - user not found");
  }
});

exports.deleteUser = catchAsync (async(req, res)=>
{
  const userId = req.params.userId;
  const userExpenses = await Expense.find({user: userId});
  const targetCategoryId = await FindCategoryIdByName('General');
  for (let i = 0; i < userExpenses.length; i++) 
  {
    await Expense.findByIdAndDelete(userExpenses[i]._id);
  }

  const userDeletionResults = await User.findByIdAndDelete(userId);

  res.json({message: userDeletionResults});
  



  
});
