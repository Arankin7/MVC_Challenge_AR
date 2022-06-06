const router = require('express').Router();
const sequelize = require('../config/connection');

const { User, Post, Comment } = require('../models');

router.get('/', (req, res) =>{
    console.log(req.session);


})

module.exports = router;