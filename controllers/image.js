const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'YOUR API KEY HERE'
});

const useClarifaiForUrl = (req, res, db) => {
    console.log('using clarifai');
    const {url} = req.body; 
    console.log('called:', url);
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