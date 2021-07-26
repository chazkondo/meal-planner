import mongoose, { Schema } from "mongoose";

const CalendarSchema = new mongoose.Schema({
	entries : [{
        type: [Schema.Types.ObjectId],
        ref: 'Ingredient',
    }],
	signature: {
		type: String,
		required: [true, 'Please provide a signature']
	},
})

module.exports = mongoose.models.Calendar || mongoose.model('Calendar', CalendarSchema);
