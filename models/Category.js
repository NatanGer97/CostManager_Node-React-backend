const mongoose = require('mongoose');
const Expense = require('./Expense');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, required: [true, 'category must have a name']},
    expenses: [{type: Schema.Types.ObjectId, ref: 'Expense'}]

});


// delete all the expenses which relate to this category
// CategorySchema.post('findOneAndDelete', async (category)=>
// {
//     if (category)
//     {
//         await Expense.deleteMany({
//             _id:{$in:category.expenses}
//         })
//     }
// });



module.exports = mongoose.model("Category", CategorySchema);