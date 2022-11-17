import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, createUser, generateValidJwt } from "./utils.js"
import User from "../database/models/userModel.js"
import Post from "../database/models/postModel.js"

let john, jane, post

beforeEach(async function () {
    cleanUpDatabase()
    // Create 2 users (for authorization)
    john = await User.create({ username: 'john', password: 'doe' })
    jane = await User.create({ username: 'jane', password: 'dae' })

    // Create a post to retrieve by id
    post = await Post.create({
        description: 'Living the life',
        location: {
            type: 'Point',
            coordinates: [117, 45]
        },
        userId: john._id
    })
})

describe('GET /posts', function () {
    test('should retrieve the list of posts', async function () {
        const token = await generateValidJwt(john);
        const res = await supertest(app)
            .get('/posts')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/)

        expect(res.body).toBeArray()
        expect(res.body).toHaveLength(1)
    })
})

describe('POST /posts', function () {
    test('should create a post', async function () {
        const token = await generateValidJwt(john);
        const res = await supertest(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                location: {
                    type: 'Point',
                    coordinates: [117, 55]
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
        expect(res.body.location.coordinates).toEqual(expect.arrayContaining([117, 55]))
        expect(res.body.description).toEqual('My last trip to LA')
        expect(res.body.visitDate).toEqual('2022-10-14T00:00:00.000Z')
        expect(res.body).toContainAllKeys(['_id', 'location', 'description', 'creationDate', 'modificationDate', 'visitDate', 'visible', 'userId', '__v'])
    })
})

describe('GET /posts/:id', function () {
    test('should retrieve a specific post and the number of comments it has', async function () {
        const token = await generateValidJwt(john);
        const res = await supertest(app)
            .get(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/)

        expect(res.body).toBeObject()
        expect(res.body.post).toBeObject()
        expect(res.body.totalComments).toEqual(0)
    })
})

describe('PATCH /posts/:id', function () {
    test('should refuse update (unauthorized user)', async function () {
        const token = await generateValidJwt(jane);
        const res = await supertest(app)
            .patch(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'My last trip to San Francisco',
            })
            .expect(403)
            .expect('Content-Type', "text/html; charset=utf-8")
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})