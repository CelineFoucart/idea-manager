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
            this.idea = null;
            try {
                this.idea = await window.api.ideaDB.findOne(id);
                return true;
            } catch (error) {
                console.log(error);
                return false;
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
                await window.api.ideaDB.remove(ideaId);
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
                await window.api.ideaDB.update(data, ideaId);
                const index = this.ideas.findIndex((element) => element._id === ideaId);
                data._id = ideaId;
                if (index !== -1) {
                    this.ideas[index] = data;
                }

                console.log(this.idea);

                if (this.idea !== null) {
                    this.idea = data;
                }

                return true;
            } catch (error) {
                return false;
            }
        }
    }
});
