const Member = require('../models/Member');
const Community = require('../models/Community');
const Role = require('../models/Role');
const User = require('../models/User');

exports.createMember = async (req, res) => {
  try {
    const { community, user, role } = req.body;

    const comm = await Community.findOne({ id: community });
    if (!comm) return res.status(404).json({ status: false, error: 'Community not found' });

    const usr = await User.findOne({ id: user });
    if (!usr) return res.status(404).json({ status: false, error: 'User not found' });

    const rl = await Role.findOne({ id: role });
    if (!rl) return res.status(404).json({ status: false, error: 'Role not found' });

    const exists = await Member.findOne({ community, user });
    if (exists) return res.status(400).json({ status: false, error: 'User already member' });

    const member = await Member.create({ community, user, role });

    res.status(201).json({
      status: true,
      content: { data: member },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.getMembersByCommunity = async (req, res) => {
  try {
    const communityId = req.params.communityId;
    const members = await Member.find({ community: communityId })
      .populate('user', 'name email id')
      .populate('role', 'name id');

    res.status(200).json({
      status: true,
      content: { data: members },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.params.memberId })
      .populate('user', 'name email id')
      .populate('role', 'name id')
      .populate('community', 'name slug id');

    if (!member) return res.status(404).json({ status: false, error: 'Member not found' });

    res.status(200).json({
      status: true,
      content: { data: member },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    const member = await Member.findOne({ id: req.params.memberId });
    if (!member) return res.status(404).json({ status: false, error: 'Member not found' });

    const roleDoc = await Role.findOne({ id: role });
    if (!roleDoc) return res.status(404).json({ status: false, error: 'Role not found' });

    member.role = role;
    await member.save();

    res.status(200).json({
      status: true,
      content: { data: member },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.deleteMember = async (req, res) => {
    try {
      const memberToDelete = await Member.findOne({ id: req.params.memberId });
      if (!memberToDelete) {
        return res.status(404).json({ status: false, error: 'Member not found' });
      }
  
      const actingMember = await Member.findOne({
        community: memberToDelete.community,
        user: req.user.id,
      }).populate('role');
  
      if (
        !actingMember ||
        !['Community Admin', 'Community Moderator'].includes(actingMember.role.name)
      ) {
        return res.status(403).json({ status: false, error: 'NOT_ALLOWED_ACCESS' });
      }
  
      await memberToDelete.deleteOne();
  
      res.status(200).json({
        status: true,
        content: { data: 'Member deleted successfully' },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: 'Server Error' });
    }
  };  