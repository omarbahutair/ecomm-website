const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

module.exports = class Repository{
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

    async create(attrs){
        attrs.id = attrs.id || this.randomId(); //to make the id what is given if it was provided
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records)
        return attrs;
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId(){
        return crypto.randomBytes(4).toString('hex')
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecordes = records.filter(record => record.id !== id);
        this.writeAll(filteredRecordes)
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        const record = records.find((record) => {
            let found = true;
            for(let key in filters){
                if(!found) return found
                found = found && (record[key] === filters[key])
            }
            return found
        })

        return record
    }
    async update (id, attrs) {
        const records = await this.getAll();
        const record = records.find((record => record.id === id));
        if(!record){
            throw new Error(`record with id ${id} not found!`);
        }
        Object.assign(record, attrs)
        this.writeAll(records)
    }
}