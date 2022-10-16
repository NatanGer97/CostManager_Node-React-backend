var express = require('express');
const { validateCategory, categoryDeletion } = require('../middleware/middelwares');
const { verifyUserToken } = require('../middleware/auth');
const Category = require('../models/Category');
const { FindCategoryById } = require('../services/CategoryService');
const catchAsync = require('../utils/catchAsync');
const NotFoundItemException = require('../utils/NotFoundItemError');
const router = express.Router();

router.use(verifyUserToken);

router.get("/", catchAsync(async (req, res,next)=>
{
    const categories = await Category.find({}).populate('expenses');   
    res.status(200).json({'categories': categories});

})); 

router.get("/:categoryId", catchAsync(async(req, res)=>
{
    const category = await FindCategoryById(req.params.categoryId);
    res.json({"category": category});
    

}));
router.put("/:categoryId", validateCategory,catchAsync(async(req, res)=>
{
    const {categoryId} = req.params;
    const newCategory = req.body.category;
    if (!newCategory)  throw new NotFoundItemException(categoryId);
    
    await Category.findByIdAndUpdate(categoryId, newCategory);    

    const{name} = newCategory;

    res.json({category:{"_id":categoryId, "name": name}});
    
}));

router.post("/", validateCategory, catchAsync (async (req,res)=> {
    
    const category = new Category(req.body.category);
    await category.save();
    res.status(201).json(category);
}));

router.delete("/:categoryId",categoryDeletion,catchAsync( async (req, res, next)=>
{
    const categoryId = req.params.categoryId;
    const itemToDelete = await Category.findById(categoryId);
    if (itemToDelete === null)  throw new NotFoundItemException(categoryId);
    const deleteResults = await Category.findByIdAndDelete(categoryId);
    res.json({"results": deleteResults});

}));


module.exports = router;
