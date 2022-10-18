const express = require('express');
const { validateExpense } = require('../middleware/middelwares');
const { verifyUserToken, AuthorizeUser } = require('../middleware/auth');
const Category = require('../models/Category');
const Expense = require('../models/Expense');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const NotFoundItemException = require('../utils/NotFoundItemError');

router.use(verifyUserToken);

router.get('/:userId', AuthorizeUser,async (req, res) => {
  try
  {
        const expenses = await Expense.find({}).populate('category',{"name":1, "_id":1});

        if (expenses)
        {
            res.json({'expenses':expenses});
        }
  }
  catch (error)
  {
      res.status(400);
      console.log(error);
      res.json(error);
  }

});


router.get('/:id/:userId', AuthorizeUser, catchAsync(async(req, res)=>
{
  const expense = await Expense.findById(req.params.id).populate('category',{expenses: 0});
  if (!expense) {throw new NotFoundItemException(req.params.id);}
    
  
  res.json({"expense": expense});

}));

router.post("/:categoryId/:userId", AuthorizeUser, validateExpense, catchAsync(async (req,res)=> {
    

    console.log("params",req.params);
    console.log("body",req.body);
    const expense = new Expense(req.body);
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);

    expense.category = category;
    expense.user = req.user.id;
    category.expenses.push(expense);
    
    
    await expense.save();
    await category.save();

    const createdItem = await Expense.findById(expense._id); /* .populate(['user', 'category']); */
    
     res.status(201).json({'expense':createdItem});
   
}));

router.put('/:id/:userId',AuthorizeUser, validateExpense,catchAsync( async (req, res) => 
{
    
      const updatedExpense = req.body.expense;
      const targetCostToUpdated = await Expense.findByIdAndUpdate(
        req.params.id,
        updatedExpense
      );

      if (targetCostToUpdated === null) throw new NotFoundItemException(req.params.id);

     
      res.json({"expense": updatedExpense});
   

}));


router.delete("/:id/:userId", AuthorizeUser, catchAsync(async (req, res) => {
    const expenseId = req.params.id;
    const itemToDelete = await Expense.findById(expenseId);
    if (itemToDelete === null) throw new NotFoundItemException(req.params.id);
   
    const deleteResults = await Expense.findByIdAndDelete(expenseId);

    res.json({"results":deleteResults})


}));




module.exports = router;
