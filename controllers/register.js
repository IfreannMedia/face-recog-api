const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = getEncryptedPassword(password);
    db.transaction(trx => {
        trx.insert({
            hash,
            email,
        })
            .into('login')
            .returning('email')
            .then((loginEmail) => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name,
                        joined: new Date()
                    }).then(response => {
                        res.json(response[0]);
                    })
            }).then(trx.commit).catch((err) => {
                trx.rollback;
                return Promise.reject(err)
            }).catch(err => {
                console.error(new Error(err));
                res.status(400).json('unable to join');
            });
    })
}

module.exports = {
    handleRegister
}