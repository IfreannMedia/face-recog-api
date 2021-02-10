const profile = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id }).then((users) => {
        res.status(users.length ? 200 : 400).json(users.length ? users[0] : `user with id ${id} not found`);
    }).catch(err => {
        console.error(new Error(err));
        res.status(400).json(err);
    })
}

module.exports = {
    profile
}