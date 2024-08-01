function validateNullOrUndefined(value) {
    if (value === "null" || value === "undefined") return null;
    else return value;
}

module.exports = {
    validateNullOrUndefined,
};
