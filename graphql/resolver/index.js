import bcrypt from 'bcryptjs';
import Event from '../../models/event';
import User from '../../models/user';

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
    } catch(err){
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.find({_id: {$in: userId}});
        return {
            ...user._doc,
            _id: user.id,
            createdEvent: events.bind(this, user._doc.createdEvent)
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
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            desc:args.eventInput.desc,
            price:+args.eventInput.price,
            date:new Date(args.eventInput.date)
        });
        let createdEvents;
        try {
            await event.save();
            createdEvent = {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            }
            const creator = await User.findById();

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
    }
};

export default resolver;

