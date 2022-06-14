const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor (filename) {
        if(!filename) {
            throw new Error('file name is required')
        }
        try {
            fs.accessSync(filename);
        } catch (err) {
            fs.writeFileSync(filename, '[]')
        }
        this.filename = filename;
    }

    async getAll(){
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }))
    }

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

    async writeAll(users) {
        await fs.promises.writeFile(this.filename, JSON.stringify(users, null, 2));
    }

    randomId(){
        return crypto.randomBytes(4).toString('hex')
    }

    async getOne(id) {
        const users = await this.getAll();
        return users.find(user => user.id === id);
    }

    async delete(id) {
        const users = await this.getAll();
        const filteredRecordes = users.filter(user => user.id !== id);
        this.writeAll(filteredRecordes)
    }

    async update (id, attrs) {
        const users = await this.getAll();
        const user = users.find((user => user.id === id));
        if(!user){
            throw new Error(`user with id ${id} not found!`);
        }
        Object.assign(user, attrs)
        this.writeAll(users)
    }

    async getOneBy(filters) {
        const users = await this.getAll();
        const user = users.find((user) => {
            let found = true;
            for(let key in filters){
                if(!found) return found
                found = found && (user[key] === filters[key])
            }
            return found
        })

        return user
    }
}

module.exports = new UsersRepository('users.json');
