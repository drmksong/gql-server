import bcrypt from 'bcryptjs';

import Event from '../../models/event';
import User from '../../models/user';
import Booking from '../../models/booking';

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            return {
                ...event._doc,
                _id : event.id,
                date : new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        });
        //return events;
    } catch(err){
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            pass: null,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch(err) {
        throw err;
    }
};

const bookedEvent = async eventId => {
    try {
        console.log(eventId);
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this,event._doc.creator)
        }
    } catch(err) {
        throw err;
    }
};

const resolver = {
    events: async () => {
        try {
            const events = await Event.find();
            return  events.map(event => {
                return{
                    ...event._doc, 
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this,event._doc.creator)
                };
            });
        } catch(err) {
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user:user.bind(this,booking._doc.user),
                    event:bookedEvent.bind(this,booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            desc:args.eventInput.desc,
            price:+args.eventInput.price,
            date:new Date(args.eventInput.date),
            creator: '5e04bcf2d7fe371444114eb3'
        });
        let createdEvents;
        try {
            const result = await event.save();
            createdEvents = {
                ...result._doc,
                _id: result.id,
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }
            const creator = await User.findById("5e04bcf2d7fe371444114eb3");

            if(!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvents;
        } catch(err) {
            throw err;
        }
    },
    createUser: async args => {
        try {
            const euser = await User.findOne({email: args.userInput.email});
            if (euser) {
                throw new Error('User already exist');
            }
            const hashPass = await bcrypt.hash(args.userInput.pass, 12);

            const user = new User({
                email: args.userInput.email,
                pass: hashPass
            });

            const result = await user.save();

            return {
                ...result._doc,
                pass: null,
                _id: result.id,
            }
        }catch (err) {
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
            return {
                ...result._doc,
                _id:result.id,
                user: user.bind(this,result._doc.user),
                event: bookedEvent.bind(this,result._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            }
        } catch (err) {
            throw err;
        }


    },
    cancelBooking: async bookingId => {
        try {
            const booking = await Booking.findById(bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: booking.event._doc.creator
            }
            await Booking.deleteOne({_id: bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    }
};

export default resolver;

