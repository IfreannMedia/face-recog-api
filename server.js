const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const register = require('./controllers/register.js');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
app.use(express.json());
app.use(cors());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

app.get('/', (req, res) => {
    console.log("OPENED SITE");
    console.log(register);
    console.log(signIn);
    console.log(profile);
    console.log(process.env.CLARIFAI_API_KEY);
    console.log(bcrypt);
    res.send('got the root');
});

app.get('/profile/:id', (req, res) => { profile.profile(req, res, db) });


app.post('/signin', (req, res) => { signIn.signIn(req, res, db) });

app.post('/register', (req, res) => {
    signIn.checkForUser(req, res, db).then(() => register.handleRegister(req, res, db, bcrypt))
        .catch(err => {
            console.error(err);
            res.status(400).json('unable to join');
        })
});

app.put('/image', (req, res) => { image.image(req, res, db) });

app.post('/imageUrl', (req, res) => { image.useClarifaiForUrl(req, res, db) });

const port = process.env.PORT || 3001;
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