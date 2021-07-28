import mongoose, {Schema} from "mongoose";

const CalendarSchema = new mongoose.Schema({
	recipe_id: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, 'Please provide the ID']
    },
    all_day: {
        type: Boolean,
        required: [true, 'Please provide the color hex']
    },
    color: {
        type: String,
        required: [true, 'Please provide the color hex']
    },
    title: {
        type: String,
        required: [true, 'Please provide the name/title']
    },
    _date: {
        type: Date,
        required: [true, 'Please provide the date']
    },
    _instance: {
        type: String,
        required: [true, 'Please provide the instance']
    },
	signature: {
		type: String,
		required: [true, 'Please provide a signature']
	},
})

module.exports = mongoose.models.Calendar || mongoose.model('Calendar', CalendarSchema);
