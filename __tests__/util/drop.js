import mongoose from 'mongoose';

export default function drop(done) {
    Object.keys(mongoose.connection.collections).map(key => {
        return mongoose.connection.collections[key].drop(err => {
            if (err) throw err;
        });
    });

    return done();
}
