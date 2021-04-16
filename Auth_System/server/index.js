const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json())

//Middleware
const authRoutes = require('./routes/auth');
const verifyToken = require('./routes/verifyToken');

const User = require('./models/User');

app.get('/', (req, res) => {
    res.send('Welcome to Auth_System');
});

app.get('/api/users/profile', verifyToken, async (req, res) => {
    res.send({success: true, data: req.user});   //req.user object is created in verifyToken.js
})

app.use('/api/users', authRoutes);

mongoose.connect('mongodb+srv://LuminousVoid:JakeTheDog101@cluster0.0wb3a.mongodb.net/auth_system?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(3000, () => console.log('Server is running'));
    })
    .catch(err => console.log(err))