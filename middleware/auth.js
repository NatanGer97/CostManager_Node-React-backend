const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const NotFoundItemException = require("../utils/NotFoundItemError");


exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next("please login to access the data");
    }

    const verify = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = await userModel.findById(verify.id);
    next();
  } catch (error) {
    return next(error);
  }
};

exports.verifyUserToken =  async(req, res, next) => {
  let token = req.headers.authorization;
  console.log("token" + token);
  if (!token)
  return res.status(401).json({message:"Unauthorized request"});

  try {
    // console.log("token", token);
    token = token.split(" ")[1]; // Remove Bearer from string

    if (token === "null" || !token)
      return res.status(401).json({message:"Unauthorized request"});

    // decoded token
    let verifiedUser = jwt.verify(token, process.env.SECRET_KEY); 
    
    if (!verifiedUser) return res.status(401).send("Unauthorized request");

    if (!await userModel.findById(verifiedUser.id)) {
      next(new NotFoundItemException(verifiedUser.id));
      // throw new NotFoundItemException(verifiedUser.id);
    }
       

    req.user = verifiedUser;
    next();

  } catch (error) {
    
    // res.status(400).send({ error: error, message: "Invalid token" });
    
    next(error);
  }
};

exports.AuthorizeUser = (req, res, next) => {
  console.log(req.user.id, req.params.id);
  console.log(req.user.id === req.params.userId);
  if (req.user.id === req.params.userId)
  {
    next();
  }
  else {
    return res.status(403).json("Unauthorized");
  }
};

exports.IsUser = async (req, res, next) => {
  if (req.user.user_type_id === 0) {
    next();
  } else {
    return res.status(401).json("Unauthorized!");
  }
};
exports.IsAdmin = async (req, res, next) => {
  console.log(req.user);
  if (req.user.user_type_id === 1) {
    next();
  } else {
    return res.status(401).json("Unauthorized!");
  }
};
