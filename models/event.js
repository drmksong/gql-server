import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        reture: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type : Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Event = mongoose.model('Event',eventSchema);
export default Event;