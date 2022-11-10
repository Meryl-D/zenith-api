import mongoose from 'mongoose';

async function resourceExists(inst, id) {
    // verify if param is a valid object id
    if (!mongoose.isValidObjectId(id)) return false
    // verify if resource exists
    if (!await inst.exists({_id: id})) return false

    return true
}

export { resourceExists }