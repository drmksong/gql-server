import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user';


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
    },
    login: async args => {
        const user = await User.findOne({email: args.email});
        if (!user) {
            throw new Error('User not found!!!');
        }
        const isEqual = await bcrypt.compare(args.pass, user.pass);
        if(!isEqual) {
            throw new Error('Incorrect password!!!');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'supersecretekey',
            {expiresIn : '1h'}
            );
        return {userId: user.id, token: token, tokenExpiration: 1};
    }
};

export default userResolver;

