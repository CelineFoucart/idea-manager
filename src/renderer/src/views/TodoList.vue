<template>
    <article>
        <header class="mb-5">
            <h1 class="display-3 fw-normal mb-1">Liste des tâches</h1>
        </header>

        <div class="card shadow-sm">
            <div class="card-header py-3">
                <div class="add-items d-flex gap-2">
                    <input v-model="newTodo" type="text" class="form-control input-sm" placeholder="Une tâche à ajouter ?" />
                    <button class="btn btn-success font-weight-bold btn-sm" @click="onAppend">Ajouter</button>
                </div>
            </div>
            <div class="card-body">
                <ul class="nav nav-pills mt-2">
                    <li role="presentation" class="nav-item">
                        <a href="#" class="nav-link" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
                            Toutes
                        </a>
                    </li>
                    <li role="presentation" class="nav-item ps-0">
                        <a href="#" class="nav-link" :class="{ active: activeTab === 'notDone' }" @click="activeTab = 'notDone'">
                            A faire
                        </a>
                    </li>
                    <li role="presentation" class="nav-item">
                        <a href="#" class="nav-link" :class="{ active: activeTab === 'done' }" @click="activeTab = 'done'">
                            Complétées
                        </a>
                    </li>
                </ul>

                <div class="my-2">
                    <TodoItem v-for="todo in todos" :key="todo._id" :todo="todo"></TodoItem>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import TodoItem from '@renderer/components/TodoItem.vue';
import { useTodoStore } from '@renderer/stores/todo.js';
import { mapStores } from 'pinia';
import { createToastify } from '@renderer/utils/toastify.js';

export default {
    name: 'TodoList',

    components: {
        TodoItem
    },

    data() {
        return {
            activeTab: 'all',
            newTodo: null
        };
    },

    computed: {
        ...mapStores(useTodoStore),

        todos() {
            const todos = [];

            this.todoStore.todos.forEach((todo) => {
                if (this.activeTab === 'all') {
                    todos.push(todo);
                } else if (this.activeTab === 'notDone' && todo.isDone === false) {
                    todos.push(todo);
                } else if (this.activeTab === 'done' && todo.isDone === true) {
                    todos.push(todo);
                }
            });

            return todos;
        }
    },

    async mounted() {
        const status = await this.todoStore.getAll();

        if (status === false) {
            createToastify('Le chargement des tâches a échoué.', 'error');
        }
    },

    methods: {
        async onAppend() {
            if (this.newTodo === null || this.newTodo.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');
                return;
            }

            const newTodo = {
                title: this.newTodo,
                content: null,
                isDone: false,
                priority: 1
            };

            const status = await this.todoStore.append(newTodo);
            if (status === false) {
                createToastify("L'opération a échoué.", 'error');
            } else {
                createToastify("L'élément a été ajouté.", 'success');
                this.newTodo = null;
            }
        }
    }
};
</script>
