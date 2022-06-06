const router = require('express').Router();
const sequelize = require('../config/connection');

const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) =>{
    console.log(req.session);

    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({plain: true}));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err)
    });
});

// Sends user to the login page if Not logged in
router.get('/login', (req, res) =>{
    if(req.session.loggedIn) {
        res.redirect('/');
        return
    }
    res.render('/login');
});

// find post with specific ID
router.get('/:id', (req, res) =>{
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({message: 'No post found with this ID'});
            return;
        }
        // serialize the data
        const post = dbPostData.get({plain: true});

        // pass the data to template
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;