import { defineStore } from 'pinia';

export const useIdeaStore = defineStore('idea', {
    state: () => ({
        ideas: [],
        idea: null
    }),

    actions: {
        async getIdeas(params = {}) {
            try {
                this.ideas = await window.api.ideaDB.findBy(params);
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },

        async findOne(id) {
            try {
                this.idea = await window.api.ideaDB.findOneAsync({ _id: id });
            } catch (error) {
                return null;
            }
        },

        async append(data) {
            try {
                const newIdea = await window.api.ideaDB.append(data);
                this.ideas.push(newIdea);

                return true;
            } catch (error) {
                return false;
            }
        },

        async remove(ideaId) {
            try {
                const status = await window.api.ideaDB.remove(ideaId);
                if (!status) {
                    return false;
                }

                const index = this.ideas.findIndex((element) => element._id === ideaId);
                if (index !== -1) {
                    this.ideas.splice(index, 1);
                }

                return true;
            } catch (error) {
                return false;
            }
        },

        async update(data, ideaId) {
            try {
                const isEdited = await window.api.ideaDB.update(data, ideaId);
                if (!isEdited) {
                    return false;
                }

                const index = this.ideas.findIndex((element) => element._id === ideaId);
                if (index !== -1) {
                    data._id = ideaId;
                    this.ideas[index] = data;
                }

                return true;
            } catch (error) {
                return false;
            }
        }
    }
});
