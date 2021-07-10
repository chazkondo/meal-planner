const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please set the name']
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
