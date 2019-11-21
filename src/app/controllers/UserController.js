import * as Yup from 'yup';

import User from '../schemas/User';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(5),
            telephone: Yup.array().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const userExists = await User.findOne({
            $or: [{ email: req.body.email }],
        });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const user = await User.create(req.body);

        return res.json(user);
    }

    async index(req, res) {
        const user = await User.findOne({
            $or: [{ email: req.body.email }],
        });

        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        res.json(user);
    }
}

export default new UserController();
