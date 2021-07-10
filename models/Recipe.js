const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
	ingredients: {
		type: Array,
		required: [true, 'Please add ingredients']
	},
    type: {
        type: String,
		required: [true, 'Please set the name']
    },
	date: {
        type: Date,
        required: [true]
    },
	signature: {
		type: String,
		required: [true, 'Please provide a signature']
	},
})

module.exports = mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);
