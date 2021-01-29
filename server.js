const express = require('express');

const app = express();
app.use(express.json());

const mockDb = {
    users: [
        {
            id: '123',
            name: 'smamcky',
            email: 'smamkyJones@johnjo.com',
            password: 'abdc1234',
            entries: 0,
            joined: new Date()
        },
        {
            id: '456',
            name: 'sally',
            email: 'sallySo@johnjo.com',
            password: 'efgh4567',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send('got the root');
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    mockDb.users.forEach((user)=>{
        if (user.id == id) {
            found = true;
            return res.json(user);
        }
    })
    if(!found) {
        res.status(404).json('no user found');
    }
});


app.post('/signin', (req, res) => {
    if (req.body.email === mockDb.users[0].email &&
        req.body.password === mockDb.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('invalid credentials');
    }
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    mockDb.users.push(
        {
            id: '500',
            name,
            email,
            password,
            entries: 0,
            joined: new Date()
        }
    )
    res.json(mockDb.users[mockDb.users.length -1]);
});

app.put('/image', (req, res)=> {
    const {id} = req.body;
    let found = false;
    mockDb.users.forEach((user)=>{
        if (user.id == id) {
            found = true;
            user.entries++;
        
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(404).json('no user found');
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
});