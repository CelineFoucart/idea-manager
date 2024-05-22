import { defineStore } from 'pinia';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: {}
    }),

    actions: {
        async getCategories() {
            try {
                const docs = await window.api.categoryDB.findBy({});
                this.categories = {};

                docs.forEach((category) => {
                    this.categories[category._id] = category;
                });

                return true;
            } catch (error) {
                return false;
            }
        },

        async append(data) {
            try {
                const newCategory = await window.api.categoryDB.append(data);
                this.categories[newCategory._id] = newCategory;

                return true;
            } catch (error) {
                return false;
            }
        },

        async remove(categoryId) {
            try {
                const status = await window.api.categoryDB.remove(categoryId);
                if (!status) {
                    return false;
                }

                if (this.categories[categoryId]) {
                    delete this.categories[categoryId];
                }

                return true;
            } catch (error) {
                return false;
            }
        },

        async update(data, categoryId) {
            try {
                const isEdited = await window.api.categoryDB.update(data, categoryId);
                if (!isEdited) {
                    return false;
                }

                if (this.categories[categoryId]) {
                    data._id = categoryId;
                    this.categories[categoryId] = data;
                }

                return true;
            } catch (error) {
                return false;
            }
        }
    }
});
