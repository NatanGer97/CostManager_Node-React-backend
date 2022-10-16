
const Category = require('../models/Category');
module.exports.FindCategoryById = async (id) =>
{
    const category = await Category.findById(id);
    if (!category) throw new NotFoundItemException(id);
    
    return category;
}

module.exports.FindCategoryIdByName = async (name) =>
{
    const category = await Category.findOne({name: name});
    if (!category) throw new NotFoundItemException(id);
    // console.log(category._id);
    
    return category.id;
}

