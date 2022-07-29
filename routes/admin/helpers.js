const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

module.exports = {
  async hashPassword(password) {
    const salt = crypto.randomBytes(4).toString("hex");
    const buff = await scrypt(password, salt, 64);
    const hashed = buff.toString("hex");
    return hashed + "." + salt;
  },
};
