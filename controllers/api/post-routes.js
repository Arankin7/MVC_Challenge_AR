const router = require('express').Router();
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');
const { Post, User, Comment } = require('../../models');
const { route } = require('./user-routes');

router.get('/', (req, res) =>{
    console.log('==========');

    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

// find individual Post
router.get('/:id', (req, res) =>{
    Post.findOne({
        where: {
            id: req.params.id
        },
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
    .then(dbPostData =>{
        if(!dbPostData){
            res.status(404).json({message: 'No Post found with this ID'});
            return
        }
        res.json(dbPostData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

// POST route 
// Add withAuth 
router.post('/', (req, res) =>{
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
        // user_id: req.session.user_id SWITCH TO THIS after implementing sessions
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err =>{
        console.log(err);
        res.status(500).json(err)
    });
});

// PUT route to update Post title
// Add withAuth
router.put('/:id', (req, res) =>{
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({message: 'No post found with this ID'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err)
    });
});

// Delete route to delete posts
router.delete('/:id', (req, res)=>{
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData =>{
        if(!dbPostData){
            res.status(404).json({message: 'No post found with this ID'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;