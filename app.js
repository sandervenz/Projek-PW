const crypto = require("crypto");
const secret = crypto.randomBytes(16).toString("hex");

console.log(secret);
