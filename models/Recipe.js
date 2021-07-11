const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
	ingredients : [{
        type: [Schema.Types.ObjectId],
        ref: 'Ingredient',
        amount: {
            type: String,
            required: [false]
        }
    }],
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
