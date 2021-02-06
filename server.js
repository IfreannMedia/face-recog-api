const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
app.use(cors());

const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'admin',
        database: 'face-recog'
    }
});

app.get('/', (req, res) => {
    res.send('got the root');
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id }).then((users) => {
        res.status(users.length ? 200 : 400).json(users.length ? users[0] : `user with id ${id} not found`);
    }).catch(err => {
        console.error(new Error(err));
        res.status(400).json(err);
    })
});


app.post('/signin', (req, res) => {
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
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
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
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id).increment('entries', 1).returning('entries').then((entries) => {
        if (entries.length) {
            res.status(200).json(entries[0]);
        } else {
            res.status(400).json('unable to increment entries');
        }
    }).catch(err => res.status(400).json('could not update entires'));
})

const port = 3001;
app.listen(port, () => {
    console.log(`app is running on port: ${port}`);
});

getEncryptedPassword = (plainTextPassword) => {
    const salt = 10;
    return bcrypt.hashSync(plainTextPassword, salt);
}

compareHash = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}