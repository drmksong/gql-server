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
            createdEvents = transformEvent(result);
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
    }
};

export default eventsResolver;
