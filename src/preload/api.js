import Datastore from '@seald-io/nedb';
import { join } from 'path';

const DATA_FOLDER = join(require('os').homedir(), '/.idea-manager');

const ideaDB = new Datastore({ filename: join(DATA_FOLDER, 'ideas.db'), autoload: true });
const categoryDB = new Datastore({ filename: join(DATA_FOLDER, 'categories.db'), autoload: true });
const todoDB = new Datastore({ filename: join(DATA_FOLDER, 'todos.db'), autoload: true });
const tagDB = new Datastore({ filename: join(DATA_FOLDER, 'tags.db'), autoload: true });

/**
 * Custom APIs for renderer
 */
export const api = {
    ideaDB: {
        findBy: async (params = {}) => {
            return await ideaDB.findAsync(params).sort({ title: 1 });
        },

        findOne: async (id) => {
            return await ideaDB.findOneAsync({ _id: id });
        },

        append: async (data) => {
            return await ideaDB.insertAsync(data);
        },

        update: async (data, id) => {
            await ideaDB.updateAsync({ _id: id }, { $set: data }, { upsert: true });
            ideaDB.loadDatabase();

            return true;
        },

        remove: async (id) => {
            await ideaDB.removeAsync({ _id: id }, {});
            ideaDB.loadDatabase();

            return true;
        }
    },

    categoryDB: {
        findBy: async (params = {}) => {
            return await categoryDB.findAsync(params).sort({ name: 1 });
        },

        append: async (data) => {
            return await categoryDB.insertAsync(data);
        },

        update: async (data, categoryId) => {
            await categoryDB.updateAsync({ _id: categoryId }, { $set: data }, { upsert: true });
            categoryDB.loadDatabase();

            return true;
        },

        remove: async (categoryId) => {
            const count = await ideaDB.countAsync({ category: categoryId });

            if (count !== 0) {
                return false;
            }

            await categoryDB.removeAsync({ _id: categoryId }, {});
            categoryDB.loadDatabase();

            return true;
        }
    },

    todoDB: {
        findBy: async (params = {}) => {
            return await todoDB.findAsync(params).sort({ title: 1 });
        },

        append: async (data) => {
            return await todoDB.insertAsync(data);
        },

        update: async (data, id) => {
            await todoDB.updateAsync({ _id: id }, { $set: data }, { upsert: true });
            todoDB.loadDatabase();

            return true;
        },

        setTagToNull: async (tagId) => {
            await todoDB.updateAsync({ tag: tagId }, { $set: { tag: null } });
            todoDB.loadDatabase();

            return true;
        },

        remove: async (id) => {
            await todoDB.removeAsync({ _id: id }, {});
            todoDB.loadDatabase();

            return true;
        }
    },

    tagDB: {
        findBy: async (params = {}) => {
            return await tagDB.findAsync(params).sort({ title: 1 });
        },

        append: async (data) => {
            return await tagDB.insertAsync(data);
        },

        update: async (data, id) => {
            await tagDB.updateAsync({ _id: id }, { $set: data }, { upsert: true });
            tagDB.loadDatabase();

            return true;
        },

        remove: async (id) => {
            await tagDB.removeAsync({ _id: id }, {});
            tagDB.loadDatabase();

            return true;
        }
    }
};
