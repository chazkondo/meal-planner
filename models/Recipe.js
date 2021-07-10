const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
	ingredients: {
		type: Array,
		required: [true, 'Please add ingredients']
	},
    color: {
        type: String,
        required: [true, 'Please add a hex color']
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

module.exports = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
