module.exports = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) return res.status(403).send('You do not have access to this area.');
    next();
  }
}