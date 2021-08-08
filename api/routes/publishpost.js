require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { IgApiClient } = require('instagram-private-api');
const {readFile} = require('fs');
const {promisify} = require('util');
const readFileAsync = promisify(readFile);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Success"
    });
});

router.post('/', upload.single('image'), (req, res, next) => {

    const filePath = req.file.path;
    const IG_USERNAME = req.body.ig_name;
    const title = req.body.title;
    const IG_PASSWORD = req.body.ig_password;

    const ig = new IgApiClient();

    const postimage = async() => {
        try {
    
            ig.state.generateDevice(IG_USERNAME);
            await ig.simulate.preLoginFlow();
            const user = await ig.account.login(IG_USERNAME, IG_PASSWORD);
    
            //Uploading Image
    
            const published = await ig.publish.photo({
                file: await readFileAsync(filePath),
                caption: title
            })
            console.log(published)
            res.status(200).json({
                message: "Image posted Successfully!"
            });

        } catch (error) {
            console.log(error);
            res.status(422).json({
                message: "ERROR!"
            });
        }
    }
    postimage();
});

module.exports = router;
