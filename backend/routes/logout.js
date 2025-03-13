require('dotenv').config();

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
