const signIn = (req, res, db) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(users => {
            console.log(users);
            if (users.length && compareHash(password, users[0].hash)) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(users => {
                        if (users.length) {
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

const checkForUser = (req, res, db) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    return db.select('email').from('login')
        .where('email', '=', email)
        .then(users => {
            if (users.length) {
                return Promise.reject('user already exists');
            } else {
                return Promise.resolve();
            }
        }).catch(err => {
            console.error(new Error(err));
            res.status(400).json('unable to check for user, something went wrong');
        })
}

module.exports = {
    signIn,
    checkForUser
}