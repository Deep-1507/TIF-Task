const Role = require('../models/Role');

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
console.log(name)
    const existing = await Role.findOne({ name });
    
    if (existing)
      return res.status(400).json({ status: false, error: 'Role already exists' });

    const role = await Role.create({ name });
    console.log(role)

    res.status(201).json({
      status: true,
      content: { data: role },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    res.status(200).json({
      status: true,
      content: { data: roles },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ id: req.params.roleId });
    if (!role) return res.status(404).json({ status: false, error: 'Role not found' });

    res.status(200).json({
      status: true,
      content: { data: role },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findOne({ id: req.params.roleId });
    if (!role) return res.status(404).json({ status: false, error: 'Role not found' });

    const { name } = req.body;

    if (name && name !== role.name) {
      const existing = await Role.findOne({ name });
      if (existing)
        return res.status(400).json({ status: false, error: 'Role name already exists' });
      role.name = name;
    }

    role.updated_at = Date.now();

    await role.save();

    res.status(200).json({
      status: true,
      content: { data: role },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findOne({ id: req.params.roleId });
    if (!role) return res.status(404).json({ status: false, error: 'Role not found' });

    await role.deleteOne();

    res.status(200).json({
      status: true,
      content: { data: 'Role deleted successfully' },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: 'Server Error' });
  }
};