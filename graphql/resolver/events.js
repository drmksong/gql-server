import Event from '../../models/event';
import User from '../../models/user';

import {transformEvent} from './merge';

const eventsResolver = {
    events: async () => {
        try {
            const events = await Event.find();
            return  events.map(event => {
                return transformEvent(event);
            });
        } catch(err) {
            throw err;
        }
    },
    createEvent: async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Authentification error');
        }
        const event = new Event({
            title: args.eventInput.title,
            desc:args.eventInput.desc,
            price:+args.eventInput.price,
            date:new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvents;
        try {
            const result = await event.save();
            createdEvents = transformEvent(result);
            const creator = await User.findById(req.userId);

            if(!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvents;
        } catch(err) {
            throw err;
        }
    }
};

export default eventsResolver;
