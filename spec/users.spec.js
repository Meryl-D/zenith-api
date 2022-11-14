import supertest from "supertest"
import app from "../app.js"

describe('POST /users', function () {
    it('should create a user', async function () {
        const res = await supertest(app)
            .post('/users')
            .send({
                username: 'John',
                password: '1234'
            })
            .expect(200)
            .expect('Content-Type', /json/);
    });
});

// describe('GET /users', function () {
//     test.todo('should retrieve the list of users');
// });