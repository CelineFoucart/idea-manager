import { defineStore } from 'pinia';

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todos: []
    }),

    actions: {
        async getAll() {
            this.todos = [];
            try {
                this.todos = await window.api.todoDB.findBy({});

                return true;
            } catch (error) {
                return false;
            }
        },

        async append(data) {
            try {
                const newTodo = await window.api.todoDB.append(data);
                this.todos.push(newTodo);

                return true;
            } catch (error) {
                return false;
            }
        },

        async remove(todoId) {
            try {
                await window.api.todoDB.remove(todoId);
                const index = this.todos.findIndex((element) => element._id === todoId);
                if (index !== -1) {
                    this.todos.splice(index, 1);
                }

                return true;
            } catch (error) {
                return false;
            }
        },

        async update(data, todoId) {
            try {
                await window.api.todoDB.update(data, todoId);
                const index = this.todos.findIndex((element) => element._id === todoId);
                if (index !== -1) {
                    data._id = todoId;
                    this.todos[index] = data;
                }

                return true;
            } catch (error) {
                return false;
            }
        },

        async removeTagReference(tagId) {
            try {
                await window.api.todoDB.setTagToNull(tagId);
                await this.getAll();
                return true;
            } catch (error) {
                return false;
            }
        }
    }
});
