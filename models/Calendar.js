import mongoose, { Schema } from "mongoose";

const CalendarSchema = new mongoose.Schema({
	ingredients : [{
        type: [Schema.Types.ObjectId],
        ref: 'Ingredient',
    }],
    amount: [{
        type: String,
        required: [false]
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

module.exports = mongoose.models.Calendar || mongoose.model('Calendar', CalendarSchema);
