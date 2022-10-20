const express = require("express");
const { validateExpense } = require("../middleware/middelwares");
const { verifyUserToken, AuthorizeUser } = require("../middleware/auth");
const Category = require("../models/Category");
const Expense = require("../models/Expense");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const NotFoundItemException = require("../utils/NotFoundItemError");
const { Query } = require("mongoose");

router.use(verifyUserToken);

router.get('/:userId/report', AuthorizeUser,async (req, res) =>
{
    const {end, start} = req.query;
  // const costs = await Expense.find( {date: {$gte: start, $lte: end} , _id:req.params.userId});
  // const costs = await Expense.find({date: {$gte: "2022-10-01", $lte: "2022-10-31"}});
  let costs = await Expense.find({date: {$gte: start, $lte: end}}).populate('category', {name:1});
  
  costs = costs.filter((cost)=> cost.user == req.params.userId)
  
  console.log(req.params.userId);
  costs.forEach(cost => console.log(cost.user == req.params.userId))
    res.send(costs);

});
router.get("/:userId", AuthorizeUser, async (req, res) => {
  try {
    console.log(req.params.userId);
    const expenses = await Expense.find({user: req.params.userId}).populate("category", {
      name: 1,
      _id: 1,
    });

    if (expenses) {
      res.json({ expenses: expenses });
    }
  } catch (error) {
    res.status(400);
    console.log(error);
    res.json(error);
  }
});

router.get(
  "/:id/:userId",
  AuthorizeUser,
  catchAsync(async (req, res) => {
    const expense = await Expense.findById(req.params.id).populate("category", {
      expenses: 0,
    });
    console.log(expense);
    if (!expense) {
      throw new NotFoundItemException(req.params.id);
    }

    const expenseDTO = {
      sum: expense.sum,
      description: expense.description,
      createdAt: expense.createdAt,
      _id: expense._id,
      category: expense.category.name,
      date: expense.date.toISOString().split("T")[0],
    };
    res.json({ expense: expenseDTO });
  })
);



router.post(
  "/:categoryId/:userId",
  AuthorizeUser,
  validateExpense,
  catchAsync(async (req, res) => {
    console.log("params", req.params);
    console.log("body", req.body);
    const expense = new Expense(req.body);
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    expense.category = category;
    expense.user = req.user.id;
    category.expenses.push(expense);

    await expense.save();
    await category.save();

    const createdItem = await Expense.findById(
      expense._id
    ); /* .populate(['user', 'category']); */

    res.status(201).json({ expense: createdItem });
  })
);

router.put(
  "/:id/:userId",
  AuthorizeUser,
  validateExpense,
  catchAsync(async (req, res) => {
    const updatedExpense = req.body;
    const targetCostToUpdated = await Expense.findByIdAndUpdate(
      req.params.id,
      updatedExpense
    );

    if (targetCostToUpdated === null)
      throw new NotFoundItemException(req.params.id);

    res.json({ expense: updatedExpense });
  })
);

router.delete(
  "/:id/:userId",
  AuthorizeUser,
  catchAsync(async (req, res) => {
    const expenseId = req.params.id;
    const itemToDelete = await Expense.findById(expenseId);
    if (itemToDelete === null) throw new NotFoundItemException(req.params.id);

    const deleteResults = await Expense.findByIdAndDelete(expenseId);

    res.json({ results: deleteResults });
  })
);

module.exports = router;
