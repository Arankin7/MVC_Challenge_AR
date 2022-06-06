const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { rmSync } = require('fs');
const { User, Post, Comment } = require('../../models');

router.get('/', (req, res) =>{
    User.findAll({
        attributes: {exclude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err =>{
        console.log(err);
        res.status(500).json(err)
    });
});

// Search for user by ID
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this ID'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) =>{
    // expects {username: "", email: "", password: ""}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData =>{
        req.session.save(() =>{
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData)
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    // expects {email: "", password: ""}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({message: 'No user found with this email address.'});
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword){
            res.status(400).json({
                message: 'Incorrect Password'
            });
            return;
        }

        req.session.save(() => {
            // declare the session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!'});
        });
    });
});

router.post('/logout', withAuth, (req, res) => {
    if(req.session.loggedIn){
        req.session.destroy(() =>{
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

router.put('/:id', withAuth, (req, res) => {
    // expects: {username: "", email: "", password: ""}
    // Passing in req.body to only update what's passed through
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        req.json(dbUserData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

route.delete('/:id', withAuth, (req, res) =>{
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData =>{
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this ID'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;