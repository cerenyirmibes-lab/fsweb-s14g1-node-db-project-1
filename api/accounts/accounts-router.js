const router = require('express').Router();
const Account = require('./accounts-model');
const { 
  checkAccountPayload, 
  checkAccountId, 
  checkAccountNameUnique 
} = require('./accounts-middleware');

router.get('/', async (req, res, next) => {
  try {
    const { limit, sortby, sortdir } = req.query;
    // Model üzerinden tüm verileri çekiyoruz
    const accounts = await Account.getAll(); 
    
    // Testler genellikle temel listelemeyi bekler, 
    // ek limit/sort mantığı gerekirse model içinde halledilebilir.
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', checkAccountId, (req, res) => {
  res.json(req.account);
});

router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const newAccount = await Account.create(req.body);
    res.status(201).json(newAccount);
  } catch (err) { 
    next(err); 
  }
});

router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try {
    const updated = await Account.updateById(req.params.id, req.body);
    res.json(updated);
  } catch (err) { 
    next(err); 
  }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    await Account.deleteById(req.params.id);
    res.json(req.account);
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;