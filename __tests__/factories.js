import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../src/app/schemas/User';

factory.define('signUp', User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    telephone: [
        {
            number: faker.phone.phoneNumber('#####-####'),
            ddd: faker.random.number(999),
        },
        {
            number: faker.phone.phoneNumber('#####-####'),
            ddd: faker.random.number(999),
        },
    ],
});

factory.define('signIn', User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    telephone: [
        {
            number: faker.phone.phoneNumber('#####-####'),
            ddd: faker.random.number(999),
        },
    ],
});

factory.define('search', User, {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    telephone: [
        {
            number: faker.phone.phoneNumber('#####-####'),
            ddd: faker.random.number(999),
        },
    ],
});

export default factory;
