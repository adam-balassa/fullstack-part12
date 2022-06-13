const express = require('express');
const router = express.Router();
const redis = require('../redis')

const configs = require('../util/config')

let visits = 0;

/* GET index data. */
router.get('/', async (req, res) => {
  if (!visits)
    visits = (await redis.getAsync('VISITS')) || 0;
  
  visits++

  redis.setAsync('VISITS', visits);

  res.send({
    ...configs,
    visits
  });
});

module.exports = router;
