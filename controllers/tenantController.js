const { Router } = require('express');
const { validateTenant, validateRegister, validateUser } = require('../validators/tenant');
const Tenant = require('../models/Tenant');
const Register = require('../models/Register');
const User = require('../models/User');

const tenantController = Router();


const createTenant = async (validated) => {
    const tenant = new Tenant({name: validated.name, status: validated.status});
    await tenant.save();
    const user = new User({
        tenant: tenant._id,
        platform: validated.platform,
        device: validated.device,
        browser: validated.browser,
    });
    await user.save();

    return { tenant_id: tenant._id, user_id: user._id };
};

const register = async (req, res) => {
    try {
        const validated = await validateRegister.validate(req.body);
        const register = new Register(validated);
        await register.save();
        return res.status(201).json({ register_id: register._id });
    } catch(error) {
        return res.status(400).json({ error: error.name, message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const validated = await validateUser(req.body);
        const user = new User({
            tenant: validated.tenantId,
            platform: validated.platform,
            device: validated.device,
            browser: validated.browser,
        });
        await user.save();
        return res.status(201).json({ user_id: user._id });
    } catch(error) {
        return res.status(400).json({ error: error.name, message: error.message });
    }
}

module.exports = {register, createTenant, createUser};