import request from 'supertest';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import app from '../../src/app';
import factory from '../factories';
import drop from '../util/drop';

describe('SignUp', () => {
    beforeEach(async done => {
        await drop(done);
    });

    afterEach(async done => {
        return done();
    });

    afterAll(async done => {
        mongoose.disconnect();
        return done();
    });

    it('usuário não deve poder se registrar com e-mail duplicado', async () => {
        const user = await factory.attrs('signUp');

        await request(app)
            .post('/signup')
            .send(user);

        const response = await request(app)
            .post('/signup')
            .send(user);

        expect(response.status).toBe(400);
    });

    it('se eu chamar a rota /signUp com dados válido para criação do usuário, ela deve me retornar os dados do usuário', async () => {
        const user = await factory.attrs('signUp');

        const response = await request(app)
            .post('/signup')
            .send(user);

        expect(response.body).toHaveProperty('_id');
    });

    it('deve criptografar a senha do usuário quando um novo usuário é criado', async () => {
        const user = await factory.create('signUp', {
            password: '12345',
        });

        const compareHash = await bcrypt.compare('12345', user.password);

        expect(compareHash).toBe(true);
    });

    it('usuário não pode ser criado caso os campos obrigatórios não estejam preenchidos', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                name: 'William Vieira',
                email: 'william.vieira@william.com.br',
                // password: '12345', -- campo obrigatório
                telephone: [
                    {
                        number: '123456789',
                        ddd: '11',
                    },
                ],
            });

        expect(response.status).toBe(400);
    });
});
