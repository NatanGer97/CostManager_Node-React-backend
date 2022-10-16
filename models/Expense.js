const mongoose = require('mongoose');
const Category = require('./Category');
const User = require('./userModel');
const Schema = mongoose.Schema;


const expenseSchema = new Schema(
  {
    sum: { type: Number, default: 0, require: [true, "sum cant be blank"] },
    description: {
      type: String,
      required: [true, "expense must have description"],
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    user: { type: Schema.Types.ObjectId, ref: "user", default: null },
  },
  { timestamps: true }
);


expenseSchema.post("findOneAndDelete", async (expense) => 
{
   if (expense)
   {
    console.log(expense);
    await Category.updateOne({_id:expense.category}, {$pull: {"expenses":expense._id}});
    } 
});

module.exports = mongoose.model('Expense', expenseSchema);