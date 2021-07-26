import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema({
	entry : {
        id: String,
        color: String,
        name: String,
        title: String,
        _date: Date,
        _instance: String
    },
	signature: {
		type: String,
		required: [true, 'Please provide a signature']
	},
})

module.exports = mongoose.models.Calendar || mongoose.model('Calendar', CalendarSchema);
