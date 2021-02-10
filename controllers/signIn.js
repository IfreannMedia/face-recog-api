const signIn = (req, res, db) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(users => {
        console.log(users);
        if(users.length && compareHash(req.body.password, users[0].hash)) {   
            return db.select('*').from('users')
            .where('email' , '=', req.body.email)
            .then(users => {
                if(users.length){
                    res.json(users[0]);
                } else {
                    console.error(new Error('user is in login and PW correct, but user not in users table'))
                    return Promise.reject('unable to sign in, credentials invalid');
                }
            })
            .catch(err => {
                console.error(new Error(err));
                return Promise.reject('unable to sign in, credentials invalid');
            })
        } else {
            return Promise.reject('Credentials do not match our records');
        }
    }).catch(err => {
        console.error(new Error(err));
        res.status(400).json('unable to sign in, credentials invalid');
    })
}

module.exports = {
    signIn
}