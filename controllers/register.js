const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    console.log("now registering user...");
    if(!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = getEncryptedPassword(password);
    console.log("got hash: ", hash);
    db.transaction(trx => {
        trx.insert({
            hash,
            email,
        })
            .into('login')
            .returning('email')
            .then((loginEmail) => {
                console.log("finished insert opertation, returning...");
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
                console.error("failed to insert: ", err);
                trx.rollback;
                return Promise.reject(err);
            }).catch(err => {
                console.error(new Error(err));
                res.status(400).json('unable to join');
            });
    })
}

module.exports = {
    handleRegister
}