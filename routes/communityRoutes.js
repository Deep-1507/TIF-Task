const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const memberController = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, communityController.createCommunity);
router.get('/', communityController.getAllCommunities);
router.get('/:communityId', communityController.getCommunityById);
router.put('/:communityId', protect, communityController.updateCommunity);
router.delete('/:communityId', protect, communityController.deleteCommunity);
router.get('/:id/members', protect, communityController.getCommunityMembers);
router.get('/me/owner', protect, communityController.getMyOwnedCommunities);
router.get('/me/member', protect, communityController.getMyJoinedCommunities);

module.exports = router;