const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
const Repository = require('./repository');

class UsersRepository extends Repository{
    async hashPassword(password, salt){
        const buff = await scrypt(password, salt, 64);
        const hashed = buff.toString('hex');
        return hashed;
    }

    async create(user){
        user.id = this.randomId();
        const users = await this.getAll();
        const salt = crypto.randomBytes(4).toString('hex');
        const hashed = await this.hashPassword(user.password, salt)
        user.password = hashed + '.' + salt;
        users.push(user);
        await this.writeAll(users)
        return user;
    }

    async comparePasswords(saved, supplied){
        const [hashed, salt] = saved.split('.');
        const hashedSupplied = await this.hashPassword(supplied, salt);
        return hashed === hashedSupplied;
    }
}

module.exports = new UsersRepository('users.json');
