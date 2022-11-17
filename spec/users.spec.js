import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase } from "./utils.js"

beforeEach(cleanUpDatabase)

describe('POST /users', function () {
    it('should create a user', async function () {
        const res = await supertest(app)
            .post('/users')
            .send({
                username: 'netflix',
                password: 'toudoum'
            })
            .expect(200)
            .expect('Content-Type', /json/)

        // Check that the response body is a JSON object with exactly the properties we expect.
        expect(res.body).toBeObject()
        expect(res.body._id).toBeString()
        expect(res.body.username).toEqual('netflix')
        expect(res.body.registrationDate).toBeString()
        expect(res.body).toContainAllKeys(['_id', 'username', 'registrationDate', '__v'])
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})