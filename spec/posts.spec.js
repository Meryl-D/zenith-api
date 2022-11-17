import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, createUser, generateValidJwt } from "./utils.js"
import User from "../database/models/userModel.js"

beforeEach(cleanUpDatabase)

describe('GET /posts', function () {
    // Create a user for authorizations.
    let user
    beforeEach(async function () {
        user = await User.create({ username: 'john', password: 'doe' })
    })

    test('should retrieve the list of posts', async function () {
        const token = await generateValidJwt(user);
        const res = await supertest(app)
            .get('/posts')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/)

        expect(res.body).toBeArray()
        expect(res.body).toHaveLength(0)
    })
})

describe('POST /posts', function () {
    let user
    beforeEach(async function () {
        user = await User.create({ username: 'john', password: 'doe' })
    })

    test('should create a post', async function () {
        const token = await generateValidJwt(user);
        const res = await supertest(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                location: {
                    type: 'Point',
                    coordinates: [90, 117]
                },
                description: 'My last trip to LA',
                visitDate: '2022-10-14',
                visible: true,
            })
            .expect(200)
            .expect('Content-Type', /json/)

        // Check that the response body is a JSON object with exactly the properties we expect.
        expect(res.body).toBeObject()
        expect(res.body._id).toBeString()
        expect(res.body.location.type).toEqual('Point')
        expect(res.body.location.coordinates).arrayContaining([90, 117])
        expect(res.body.description).toEqual('My last trip to LA')
        expect(res.body.visitDate).toEqual('2022-10-14T00:00:00')
        expect(res.body).toContainAllKeys(['_id', 'location', 'description', 'creationDate', 'modificationDate', 'visitDate', 'visible', 'userId', '__v'])
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})