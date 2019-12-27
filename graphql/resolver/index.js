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
        //return events;
    } catch(err){
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById( userId);
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
    }
};

export default resolver;

