const express = require('express');

const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    const user = await db.getUser(req.signedCookies.userId);
    const eligibilityCodes = await db.getAgencyEligibilityCodes(user.agency.id, { enabled: true });
    const enabledECodes = eligibilityCodes.filter((e) => e.enabled);
    const keywords = await db.getAgencyKeywords(user.agency.id);
    const grants = await db.getGrants({
        ...req.query,
        filters: {
            eligibilityCodes: enabledECodes.map((c) => c.code),
            keywords: keywords.map((c) => c.search_term),
        },
    });
    res.json(grants);
});

router.put('/:grantId/view/:agencyId', async (req, res) => {
    const user = await db.getUser(req.signedCookies.userId);
    const { agencyId, grantId } = req.params;
    await db.markGrantAsViewed({ grantId, agencyId, userId: user.id });
    res.json({});
});

router.get('/:grantId/interested', async (req, res) => {
    const { grantId } = req.params;
    const interestedAgencies = await db.getInterestedAgencies({ grantIds: [grantId] });
    res.json(interestedAgencies);
});

router.put('/:grantId/interested/:agencyId', async (req, res) => {
    const user = await db.getUser(req.signedCookies.userId);
    const { agencyId, grantId } = req.params;
    let interestedCode = null;
    if (req.body && req.body.interestedCode) {
        interestedCode = req.body.interestedCode;
    }
    await db.markGrantAsInterested({
        grantId,
        agencyId,
        userId: user.id,
        interestedCode,
    });
    res.json({});
});

module.exports = router;