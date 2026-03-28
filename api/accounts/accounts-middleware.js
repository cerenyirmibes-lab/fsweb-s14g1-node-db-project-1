const Account = require('./accounts-model');

const checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;
  if (name === undefined || budget === undefined) {
    return res.status(400).json({ message: "name and budget are required" });
  }
  
  const trimmedName = name.trim();
  if (trimmedName.length < 3 || trimmedName.length > 100) {
    // Mesajın tam olarak bu olduğundan emin ol
    return res.status(400).json({ message: "name of account must be between 3 and 100" });
  }
  
  if (typeof budget !== 'number' || isNaN(budget)) {
    return res.status(400).json({ message: "budget of account must be a number" });
  }
  
  if (budget < 0 || budget > 1000000) {
    return res.status(400).json({ message: "budget of account is too large or too small" });
  }

  req.body.name = trimmedName;
  next();
};

const checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "account not found" });
    }
    req.account = account;
    next();
  } catch (err) {
    next(err);
  }
};

const checkAccountNameUnique = async (req, res, next) => {
  try {
    // name.trim() yapmayı unutma
    const name = req.body.name.trim();
    const existing = await Account.getAll();
    const isTaken = existing.find(acc => acc.name === name);
    
    if (isTaken) {
      // TESTİN BEKLEDİĞİ TAM MESAJ:
      return res.status(400).json({ message: "name is taken" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique
};