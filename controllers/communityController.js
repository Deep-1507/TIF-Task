const Community = require('../models/Community');
const Member = require('../models/Member');

exports.createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const owner = req.user.id;
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const existing = await Community.findOne({ slug });
    if (existing)
      return res.status(400).json({ status: false, error: 'Slug already exists' });

    const community = await Community.create({ name, slug, owner });


    res.status(201).json({
      status: true,
      content: {
        id: community.id,
        name: community.name,
        slug: community.slug,
        owner: community.owner,
        created_at: community.created_at,
        updated_at: community.updated_at
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json({
      status: true,
      content: {
        data: communities,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.getCommunityById = async (req, res) => {
  try {
    const community = await Community.findOne({ id: req.params.communityId });
    if (!community)
      return res.status(404).json({ status: false, error: 'Community not found' });

    res.status(200).json({
      status: true,
      content: {
        data: community,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    const community = await Community.findOne({ id: req.params.communityId });
    if (!community)
      return res.status(404).json({ status: false, error: 'Community not found' });

    // Only owner can update
    if (community.owner !== req.user.id)
      return res.status(403).json({ status: false, error: 'Forbidden' });

    const { name, slug } = req.body;

    if (slug && slug !== community.slug) {
      // Check slug uniqueness
      const slugExists = await Community.findOne({ slug });
      if (slugExists)
        return res.status(400).json({ status: false, error: 'Slug already exists' });
    }

    community.name = name ?? community.name;
    community.slug = slug ?? community.slug;
    community.updated_at = Date.now();

    await community.save();

    res.status(200).json({
      status: true,
      content: {
        data: community,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findOne({ id: req.params.communityId });
    if (!community)
      return res.status(404).json({ status: false, error: 'Community not found' });

    if (community.owner !== req.user.id)
      return res.status(403).json({ status: false, error: 'Forbidden' });

    await community.deleteOne();

    await Member.deleteMany({ community: community.id });

    res.status(200).json({
      status: true,
      content: {
        data: 'Community deleted successfully',
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.getCommunityMembers = async (req, res) => {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
  
      const total = await Member.countDocuments({ community: id });

      console.log(total)
  
      const members = await Member.find({ community: id })
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total,
            pages: Math.ceil(total / limit),
            page
          },
          data: members
        }
      });
    } catch (err) {
      res.status(500).json({ status: false, error: 'Server Error' });
    }
  };

  
  exports.getMyOwnedCommunities = async (req, res) => {
    try {
      const ownerId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
  
      const total = await Community.countDocuments({ owner: ownerId });
  
      const communities = await Community.find({ owner: ownerId })
        .skip(skip)
        .limit(limit);
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total,
            pages: Math.ceil(total / limit),
            page
          },
          data: communities
        }
      });
    } catch (err) {
      res.status(500).json({ status: false, error: 'Server Error' });
    }
  };

  

  exports.getMyJoinedCommunities = async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
  
      const memberDocs = await Member.find({ user: userId })
  
      const total = await Member.countDocuments({ user: userId });
  
      const communities = memberDocs.map((member) => member.community);
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total,
            pages: Math.ceil(total / limit),
            page
          },
          data: communities
        }
      });
    } catch (err) {
      res.status(500).json({ status: false, error: 'Server Error' });
    }
  };