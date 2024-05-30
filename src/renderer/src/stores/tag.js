import { defineStore } from 'pinia';

export const useTagStore = defineStore('tag', {
    state: () => ({
        tags: []
    }),

    actions: {
        async getAll() {
            try {
                const docs = await window.api.tagDB.findBy({});
                this.tags = {};

                docs.forEach((tag) => {
                    this.tags[tag._id] = tag;
                });

                return true;
            } catch (error) {
                return false;
            }
        },

        async append(data) {
            try {
                const newTag = await window.api.tagDB.append(data);
                this.tags[newTag._id] = newTag;

                return true;
            } catch (error) {
                return false;
            }
        },

        async remove(id) {
            try {
                await window.api.tagDB.remove(id);
                if (this.tags[id]) {
                    delete this.tags[id];
                }

                return true;
            } catch (error) {
                return false;
            }
        },

        async update(data, id) {
            try {
                await window.api.tagDB.update(data, id);
                if (this.tags[id]) {
                    data._id = id;
                    this.tags[id] = data;
                }

                return true;
            } catch (error) {
                return false;
            }
        }
    }
});
