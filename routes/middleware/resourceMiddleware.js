import mongoose from 'mongoose';

function resourceExists(model) {
    return async function (req, res, next) {
        // Format model name
        let modelName = model.collection.collectionName
        modelName = modelName[0].toUpperCase() + modelName.slice(1, -1)
        // verify if param is a valid object id
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).send(`${modelName} not found`)

        try {
            // verify if resource exists
            const inst = await model.findById(req.params.id)
            if (!inst) return res.status(404).send(`${modelName} not found`)
            // add resource user id for later authorization
            req.resourceUserId = inst.userId
            next()

        } catch(err) {
            res.status(500).send(err)
        }
    }
}

function checkResourceId(req, res, next) {
    // check if ID already exists. If it doesn't create a new one
    if (req?.params?.id) {
        console.log('was here')
        req.resourceId = req.params.id
    } else {
        req.resourceId = new mongoose.Types.ObjectId()
    }
    next()
}

export { resourceExists, checkResourceId }