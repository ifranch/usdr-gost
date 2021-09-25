const { getUser } = require('../db');

/**
 * Determine if a user is authorized for an agency.
 *
 * @param {Number} userId
 * @param {Number} agencyId
 * @returns {Boolean} true if the agency is the user's or a descendant; false otherwise
 */
async function isAuthorized(userId, agencyId) {
    const user = await getUser(userId);
    return user.agency.subagencies.indexOf(agencyId) >= 0;
}

async function requireAdminUser(req, res, next) {
    if (!req.signedCookies.userId) {
        res.sendStatus(403);
        return;
    }

    const user = await getUser(req.signedCookies.userId);
    if (user.role_name !== 'admin') {
        res.sendStatus(403);
        return;
    }

    const queryAgency = Number(req.query.agency);
    const paramAgency = Number(req.params.agency);
    const bodyAgency = Number(req.body.agency);
    const bodyAgencyId = Number(req.body.agency_id);

    let count = 0;
    if (!Number.isNaN(queryAgency)) count += 1;
    if (!Number.isNaN(paramAgency)) count += 1;
    if (!Number.isNaN(bodyAgency)) count += 1;
    if (!Number.isNaN(bodyAgencyId)) count += 1;

    if (count > 1) {
        res.sendStatus(400); // ambiguous request
        return;
    } if (count === 1) {
        // Is this user an admin of the specified agency?
        const authorized = await isAuthorized(req.signedCookies.userId,
            queryAgency || paramAgency || bodyAgency || bodyAgencyId || 0);
        if (!authorized) {
            res.sendStatus(403);
            return;
        }
    }

    next();
}

async function requireUser(req, res, next) {
    if (!req.signedCookies.userId) {
        res.sendStatus(403);
        return;
    }

    const user = await getUser(req.signedCookies.userId);
    if (req.query.agency && user.role_name === 'staff') {
        res.sendStatus(403); // Staff are restricted to their own agency.
        return;
    }

    // User NOT required to be admin; but if they ARE, they must satisfy admin rules.
    if (user.role_name === 'admin') {
        await requireAdminUser(req, res, next);
        return;
    }

    next();
}

module.exports = {
    requireAdminUser, requireUser, isAuthorized,
};
