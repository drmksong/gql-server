
import Event from '../../models/event';
import Booking from '../../models/booking';

import {transformEvent,transformBooking} from './merge';

const bookingResolver = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Athentification error');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Athetification error');
        }
        try {
            const fetchedEvent = await Event.findOne({_id:args.eventId});
            const booking = new Booking({
                user:req.userId,
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (err) {
            throw err; 
        }
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Athetification error');
        }
        try {
            const booking = await Booking.findOne({_id:args.bookingId}).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    }
};
                
export default  bookingResolver;

