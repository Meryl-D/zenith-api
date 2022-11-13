import mongoose from "mongoose";
import multer from "multer";

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads`)
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')
        console.log(ext[1])
        req.ext = ext[1]
        // Use post ID in the name so its unique and automatically replaced when the user changes the posts picture
        cb(null, `zenith_${req.resourceId}.${ext[1]}`)
    }
});

const multerFilter = function (req, file, cb) {
    // Check file format
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
        req.fileFormatError = 'Invalid file format';
        return cb(null, false, new Error('Invalid file format'));
    }
    cb(null, true)
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

export { upload }