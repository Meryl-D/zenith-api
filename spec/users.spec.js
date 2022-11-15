import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase } from "./utils.js"

beforeEach(cleanUpDatabase);

describe('POST /users', function () {
    it('should create a user', async function () {
        const res = await supertest(app)
            .post('/users')
            .send({
                username: 'netflix',
                password: 'toudoum'
            })
            .expect(200)
            .expect('Content-Type', /json/);
    });
});

// describe('GET /users', function () {
//     test.todo('should retrieve the list of users');
// });

afterAll(async () => {
    await mongoose.disconnect();
  });