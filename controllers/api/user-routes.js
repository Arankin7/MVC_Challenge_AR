const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { rmSync } = require('fs');
const { User, Post, Comment } = require('../../models');

router.get('/', (req, res) =>{
    console.log('All users')
});


module.exports = router;