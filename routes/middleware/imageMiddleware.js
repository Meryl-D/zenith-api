import mongoose from "mongoose";
import multer from "multer";

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads`)
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')
        // Use post ID in the name so its unique and automatically replaced when the user changes the posts picture
        cb(null, `zenith_${req.resourceId}.${ext[1]}`)
    }
});

const multerFilter = function (req, file, cb) {
    // Check file format
    if (file.mimetype !== 'image/jpeg') {
        req.fileFormatError = 'Invalid file format. Must be .jpg';
        return cb(null, false, new Error('Invalid file format. Must be .jpg'));
    }
    cb(null, true)
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 31457280 }
})

export { upload }