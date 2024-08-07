const { Router } = require('express');
const {
  getSingleToken,
  getAllTokens,
  getFullTokenInfo,
} = require('./tokens.Service');
const { getSpecificContracts } = require('../contracts/contracts.Service');
const {
  validation,
} = require('../../middleware');

const router = Router();

router.get(
  '/',
  validation(['dbTokens', 'pagination'], 'query'),
  getSpecificContracts,
  getAllTokens,
);

router.get(
  '/:token',
  validation(['tokenNumber'], 'params'),
  validation(['getTokenNumbers'], 'query'),
  getSpecificContracts,
  (req, res, next) => {
    const { contract, offers, offerPool } = req.query;
    if (contract?.diamond && offers) {
        req.specificFilterOptions = { offer: { $in: offers } };
    } else if (offerPool) {
      req.specificFilterOptions = { offerPool: offerPool.marketplaceCatalogIndex };
    }
    return next();
  },
  getSingleToken,
);

router.get(
  '/id/:id',
  validation(['dbId'], 'params'),
  getFullTokenInfo,
);

module.exports = router;
