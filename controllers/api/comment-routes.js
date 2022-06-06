const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Comment } = require('../../models');

router.get('/', (req, res) =>{
    Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// NOTE FOR INSOMNIA - Disable withAuth when using insmomnia to check the api route
router.post('/', withAuth, (req, res) =>{
    // Check the session
    if(req.session){
        // Expects: {comment_text: "", "user_id": "", post_id: ""}
        Comment.create({
            comment_text: req.body.comment_text,
            user_id: req.session.user_id,
            post_id: req.body.post_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err =>{
            console.log(err);
            res.status(500).json(err);
        });
    }
});

router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData =>{
        if(!dbCommentData){
            res.status(404).json({message: 'No comment found with this ID'});
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});



module.exports = router;