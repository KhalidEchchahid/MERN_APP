const express = require('express') ;
const router = express.Router() ;
const { getPosts, getPostsBySearch, getPost, createPost, updatePost, likePost, deletePost } =require('../controllers/posts')
const auth = require('../middleware/Auth');


router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);


router.post('/', auth,  createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);



module.exports = router
