const Category = require("../models/Category");
const Expense = require("../models/Expense");
const { FindCategoryIdByName } = require("../services/CategoryService");
const ExpressError = require("../utils/ExpressError");
const { expenseSchema, categorySchema, UserSchema } = require("../ValidationSchemas/ValidationSchemas")

module.exports.validateExpense = (req, res, next) =>
{
    const {error} = expenseSchema.validate(req.body);
    if (error)
    {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message,400);
    }
    else 
    {
        next();
    }
};

module.exports.validateUser= (req, res, next) =>
{
    const {error} = UserSchema.validate(req.body);
    
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message,400);
    }
    else next();
}

module.exports.validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {

    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);

  } else {
    next();
  }
};

// middleware which replace the category of each expense in this category before deletion
module.exports.categoryDeletion = async (req, res, next) =>
{
    const {categoryId} = req.params;
    const categoryExpenses = await Category.findOne({_id: categoryId})
    .populate('expenses');
    const targetCategoryId = await FindCategoryIdByName('General');
    await Expense.updateMany({_id:{$in: categoryExpenses.expenses}},{category:targetCategoryId});
    await Category.updateOne({_id:targetCategoryId},{$push:{expenses: categoryExpenses.expenses}});

    next();
}

module.exports.userDeletion = async (req, res, next) =>
{
    const userId = req.params.userId;
    const userExpenses = await Expense.find({user: userId});
    console.log(userExpenses);
    const targetCategoryId = await FindCategoryIdByName('General');

    res.json(userExpenses);
    for(let i = 0; i < userExpenses.length; i++)
    {
        const categoryExpenses = await Category.findOne({_id: userExpenses[i].category});
        await Expense.updateMany({_id:{$in: categoryExpenses.expenses}},{category:targetCategoryId});
        await Category.updateOne({_id:targetCategoryId},{$push:{expenses: categoryExpenses.expenses}});
    

    }
    

}