const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [4, "Name should be minimum of 4 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [3, "Password should be minimum of 8 characters"],
    },
    token: {
      type: String,
    },
    // expenses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Expense'}],
  },
  { timestamps: true }
);



const userModel = mongoose.model('user',userSchema);
module.exports = userModel;