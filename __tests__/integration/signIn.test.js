import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';
import User from '../../src/app/schemas/User';

describe('SignIn', () => {
    it('Os campos email e password devem ser preenchido corretamente', async () => {
        const user = await factory.create('signIn', {
            password: '123d45',
        });

        const response = await request(app)
            .get('/signin')
            .send({
                email: user.email,
                password: '122345',
            });

        expect(response.status).toBe(400);
    });

    it('caso o usuário tentar logar na aplicação com o password inválido', async () => {
        const user = await factory.create('signIn', {
            password: '12345',
        });

        const response = await request(app)
            .get('/signin')
            .send({
                email: user.email,
                password: '1223475',
            });

        expect(response.status).toBe(400);
    });

    it('caso o usuário tentar logar na aplicação com o email inválido', async () => {
        const user = await factory.create('signIn', {
            password: '12345',
        });

        const response = await request(app)
            .get('/signin')
            .send({
                email: 'teste@teste.com',
                password: user.password,
            });

        expect(response.status).toBe(400);
    });

    it('caso o usuário tentar logar na aplicação sem preencher os campos obrigatório', async () => {
        await factory.create('signIn', {
            password: '12345',
        });

        const response = await request(app)
            .get('/signin')
            .send({
                // email: 'teste@teste.com', -- campo obrigatório
                password: '12345',
            });

        expect(response.status).toBe(400);
    });

    it('Usuario só pode logar na aplicação se o token estiver correto', async () => {
        const user = await factory.create('signIn');

        const response = await request(app)
            .get('/signin')
            .send({
                email: user.email,
                password: user.password,
            });

        expect(response.status).toBe(400);
    });

    it('Caso o e-mail exista e a senha seja a mesma que a senha persistida, retornar os dados do usuário', async () => {
        const user = await User.create({
            name: 'William Vieira',
            email: 'william@william.com.br',
            password: '12345',
            telephone: [
                {
                    number: '123456789',
                    ddd: '11',
                },
            ],
        });

        const response = await request(app)
            .get('/signin')
            .set('Authorization', `bearer ${user.token}`)
            .send({
                email: 'william@william.com.br',
                password: '12345',
            });

        expect(response.body).toHaveProperty('email');
    });

    it('Caso o usuário tente realizar uma buscar de usuário com o token válido', async () => {
        const user = await factory.create('signUp', {
            password: '12345',
        });

        const response = await request(app)
            .get('/users')
            .set('Authorization', `bearer ${user.token}`)
            .send({
                email: user.email,
                password: '12345',
            });
        expect(response.body).toHaveProperty('_id');
    });

    it('Caso o usuário tente realizar uma buscar de usuário com o token inválido', async () => {
        const user = await factory.create('signUp', {
            password: '12345',
        });

        const response = await request(app)
            .get('/users')
            .set('Authorization', ``)
            .send({
                email: user.email,
                password: '12345',
            });
        expect(response.status).toBe(401);
    });

    it('Caso o usuário tente realizar uma buscar de usuário com o token inválido', async () => {
        const user = await factory.create('signUp', {
            password: '12345',
        });

        const response = await request(app)
            .get('/users')
            .set('Authorization', `bearer 234dsx`)
            .send({
                email: user.email,
                password: '12345',
            });
        expect(response.status).toBe(401);
    });

    it('Caso o usuário tente buscar usuário com o email incorreto', async () => {
        const user = await User.create({
            name: 'William Vieira',
            email: 'william.vieira@william.com.br',
            password: '12345',
            telephone: [
                {
                    number: '123456789',
                    ddd: '11',
                },
            ],
        });

        const response = await request(app)
            .get('/users')
            .set('Authorization', `bearer ${user.token}`)
            .send({
                email: 'teste@teste.com.br',
                password: '12345',
            });

        expect(response.status).toBe(400);
    });
});
