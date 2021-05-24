const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
});

const useClarifaiForUrl = (req, res, db) => {
    const {url} = req.body; 
    app.models.predict(Clarifai.FACE_DETECT_MODEL, url).then((clarifaiResult) => {
        res.status(200).json(clarifaiResult);
    }).catch(err => {
        console.error(new Error(err));
        res.status(400).json('clarifai failed to detect faces');
    });
}


const image = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id).increment('entries', 1).returning('entries').then((entries) => {
        if (entries.length) {
            res.status(200).json(entries[0]);
        } else {
            res.status(400).json('unable to increment entries');
        }
    }).catch(err => res.status(400).json('could not update entires'));
}

module.exports = {
    image,
    useClarifaiForUrl
}