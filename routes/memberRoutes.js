const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, memberController.createMember);
router.get('/community/:communityId', protect, memberController.getMembersByCommunity);
router.get('/:memberId', protect, memberController.getMemberById);
router.put('/:memberId', protect, memberController.updateMemberRole);
router.delete('/:memberId', protect, memberController.deleteMember);

module.exports = router;