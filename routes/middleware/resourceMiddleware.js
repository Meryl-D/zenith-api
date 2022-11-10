import mongoose from 'mongoose';

function resourceExists(model) {
    return async function (req, res, next) {
        // Format model name
        let modelName = model.collection.collectionName
        modelName = modelName[0].toUpperCase() + modelName.slice(1, -1)
        // verify if param is a valid object id
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).send(`${modelName} not found`)
        // verify if resource exists
        if (!await model.exists({ _id: req.params.id })) return res.status(404).send(`${modelName} not found`)

        next()
    }
}

export  default resourceExists