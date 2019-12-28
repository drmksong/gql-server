
import Event from '../../models/event';
import Booking from '../../models/booking';

import {transformEvent,transformBooking} from './merge';

const bookingResolver = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({_id:args.eventId});
            const booking = new Booking({
                user:'5e04bcd6d7fe371444114eb2',
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (err) {
            throw err;
        }


    },
    cancelBooking: async args => {
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

