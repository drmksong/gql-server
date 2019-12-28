import bcrypt from 'bcryptjs';

import User from '../../models/user';

import {transformEvent,transformBooking,events,user,bookedEvent} from './merge';


const userResolver = {
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

export default userResolver;

