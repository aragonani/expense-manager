const { getUser } = require('../service/auth');

function checkAuth(req, res, next) {
    const uid = req.cookies?.uid;
    const user = uid ? getUser(uid) : null;
    req.user = user;
    next();
}

function requireAuth(req, res, next) {
    const uid = req.cookies?.uid;
    if (!uid) return res.redirect('/login');

    const user = getUser(uid);
    if (!user) return res.redirect('/login');

    req.user = user;
    next();
}

function restrictTo(roles) {
    return function(req, res, next) {
        if (!req.user) return res.redirect('/login');
        if (!roles.includes(req.user.role)) {
            return res.status(403).send("You do not have permission to perform this action");
        }
        next();
    }
}

module.exports = { checkAuth, requireAuth, restrictTo };
