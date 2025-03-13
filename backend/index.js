require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const servicesRoute = require('./routes/services');
const resourcesRoute = require('./routes/resources');
const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');

const catalogDatabaseUrl = process.env.CATALOG_DATABASE_URL;

mongoose.connect(catalogDatabaseUrl);
const users = mongoose.connection;

users.on('error', (error) => {
    console.log("Database connection error" + error)
})

users.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions)); app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).send('Unauthorized');
        }

        req.user = decoded;
        next();
    });
}

app.use('/api/services', verifyToken, servicesRoute);
app.use('/api/resources', verifyToken, resourcesRoute);
app.use('/api/login', loginRoute);
app.use('/api/logout', logoutRoute);

app.listen(3006, () => {
    console.log(`Server Started at ${3006}`)
})
