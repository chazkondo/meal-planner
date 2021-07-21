const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please set the name']
	},
    type: {
        type: String,
		required: [true, 'Please set the type']
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

module.exports = mongoose.models.Item || mongoose.model('Ingredient', ItemSchema);
