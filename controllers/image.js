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
    image
}