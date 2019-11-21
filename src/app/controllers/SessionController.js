import * as Yup from 'yup';

import User from '../schemas/User';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(5),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { email, password } = req.body;

        const user = await User.findOne({
            $or: [{ email }],
        });

        if (!user) {
            return res.status(400).json({ error: 'email not found.' });
        }

        if (!(await user.comparePassword(password))) {
            return res.status(400).json({ error: 'Password does not match.' });
        }

        return res.json(user);
    }
}

export default new SessionController();
