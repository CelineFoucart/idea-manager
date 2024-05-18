import Datastore from '@seald-io/nedb';

export class Manager {
    constructor(filename, autoload = true) {
        this.db = new Datastore({ filename: filename, autoload: autoload });
    }

    /**
     * Returns all documents in the database if no params given.
     *
     * @param {object} [params={}]
     *
     * @returns {array}
     */
    async findBy(params = {}) {
        try {
            return await this.db.findAsync(params);
        } catch (error) {
            return [];
        }
    }

    /**
     * Returns a single document or null.
     *
     * @param {string} id the document unique identifier
     *
     * @returns {object|null} the document or null if no result is found
     */
    async findOne(id) {
        try {
            return await this.db.findOneAsync({ _id: id });
        } catch (error) {
            return null;
        }
    }

    /**
     * Inserts a new document.
     *
     * @param {object} data
     *
     * @returns {object|null} the created document or null in case of error
     */
    async create(data) {
        try {
            return await this.db.insertAsync(data);
        } catch (error) {
            return null;
        }
    }

    /**
     * Edits a document.
     *
     * @param {string} id   the document unique identifier
     * @param {object} data the new data
     *
     * @returns {boolean}
     */
    async update(id, data) {
        try {
            await this.db.updateAsync({ _id: id }, { $set: data }, { upsert: true });
            this.db.loadDatabase();

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Deletes a document.
     *
     * @param {string} id the document unique identifier
     *
     * @returns {boolean}
     */
    async delete(id) {
        try {
            await this.db.removeAsync({ _id: id }, {});
            this.db.loadDatabase();

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Counts documents.
     *
     * @param {object} [params={}] the query with field name in key and condition as value.
     * @returns {integer|null}
     */
    async count(params = {}) {
        try {
            return await this.db.records.countAsync(params);
        } catch (error) {
            return null;
        }
    }
}
