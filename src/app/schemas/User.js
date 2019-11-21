import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { zonedTimeToUtc } from 'date-fns-tz';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        telephone: {
            type: Array,
            required: true,
        },
        last_login: {
            type: Date,
        },
        token: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre('save', async function passwordHash(next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, 8);
    user.token = jwt.sign({ email: user.email }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
    });
    user.last_login = zonedTimeToUtc(new Date(), 'America/Sao_Paulo');

    next();
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
