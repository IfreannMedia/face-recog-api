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

app.get('/profile/:id', (req, res) => {profile.profile(req, res, db)});


app.post('/signin', (req, res)=> {signIn.signIn(req, res, db)});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.put('/image', (req, res) => {image.image(req, res, db)});

app.post('/imageUrl', (req, res) => {image.useClarifaiForUrl(req, res, db)});  

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