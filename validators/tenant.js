const { object, string } = require('yup');

const validateTenant = object({
    name: string().required(),
    status: string().required(),
    platform: string().required(),
    device: string().required(),
    browser: string().required()
}).json().required();

const validateRegister = object({
    platform: string().required(),
    device: string().required(),
    browser: string().required(),
    checkHash: string().required(),
}).json().required();

const validateUser = object({
    platform: string().required(),
    device: string().required(),
    browser: string().required(),
    tenant_id: string().required(),
}).json().required();

module.exports = {
    validateTenant,
    validateRegister,
    validateUser
}