import Datastore from '@seald-io/nedb';

const ideaDB = new Datastore({ filename: 'data/ideas.db', autoload: true });
const categoryDB = new Datastore({ filename: 'data/categories.db', autoload: true });
const todoDB = new Datastore({ filename: 'data/todos.db', autoload: true });

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
            return await todoDB.findAsync(params).sort({ name: 1 });
        },

        append: async (data) => {
            return await todoDB.insertAsync(data);
        },

        update: async (data, id) => {
            await todoDB.updateAsync({ _id: id }, { $set: data }, { upsert: true });
            todoDB.loadDatabase();

            return true;
        },

        remove: async (id) => {
            await todoDB.removeAsync({ _id: id }, {});
            todoDB.loadDatabase();

            return true;
        }
    }
};
