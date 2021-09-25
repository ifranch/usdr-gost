const express = require('express');

const router = express.Router();
const { requireAdminUser, isAuthorized } = require('../lib/access-helpers');
const { sendWelcomeEmail } = require('../lib/email');
const db = require('../db');

router.post('/', requireAdminUser, async (req, res, next) => {
    if (!req.body.email) {
        res.status(400).send('User email is required');
        return;
    }

    try {
        const user = {
            email: req.body.email.toLowerCase(),
            name: req.body.name,
            role_id: req.body.role,
            agency_id: req.body.agency,
        };
        const result = await db.createUser(user);
        res.json({ user: result });
        await sendWelcomeEmail(user.email, req.headers.origin);
    } catch (e) {
        if (e.message.match(/violates unique constraint/)) {
            res.status(400).send('User with that email already exists');
        } else {
            next(e);
        }
    }
});

router.get('/', requireAdminUser, async (req, res) => {
    let { agency } = req.query;
    if (!agency) {
        // Agency not in query string, so default to this admin's agency.
        const user = await db.getUser(req.signedCookies.userId);
        agency = user.agency_id;
    }

    const users = await db.getUsers(agency);
    res.json(users);
});

router.delete('/:userId', requireAdminUser, async (req, res) => {
    // Get agency of user to be deleted.
    const { agency_id } = await db.getUser(req.params.userId);

    // Is this admin user authorized for that agency?
    const authorized = await isAuthorized(req.signedCookies.userId, agency_id);
    if (!authorized) {
        res.sendStatus(403);
        return;
    }

    const deleteCount = await db.deleteUser(req.params.userId);
    if (deleteCount === 1) {
        res.json({});
    } else {
        res.status(400).send('No such user');
    }
});

module.exports = router;
