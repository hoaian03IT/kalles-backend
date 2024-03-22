const UserModal = require("../models/user");

async function checkRole(_id) {
    const user = await UserModal.findById(_id);
    return !!user ? user.role : null;
}

function checkAdminRole(req, res, next) {
    try {
        const role = checkRole(req._id);
        if (role !== "admin") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.role = role;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { checkAdminRole };
