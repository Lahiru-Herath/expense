const {Router} = require('express');
const {
    registerUser,
    loginUser,
    getUser,
    updateAvatar,
    updateUser,
    getAuthors
} = require('../controllers/userControllers');

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.get('/', getAuthors);
router.post('/update-avatar', updateAvatar);
router.patch('/update-user', updateUser);

module.exports = router;