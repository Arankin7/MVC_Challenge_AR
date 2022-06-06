const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Comment } = require('../../models');

router.get('/', (req, res) =>{
    console.log('All Comments')
});



module.exports = router;