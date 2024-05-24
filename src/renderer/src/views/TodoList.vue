<template>
    <article>
        <header class="mb-5">
            <h1 class="display-3 fw-normal mb-1">Liste des tâches</h1>
        </header>

        <div class="card shadow-sm mt-4">
            <div class="card-header py-0">
                <div class="row align-items-end">
                    <div class="col-6 col-md-8 col-lg-9">
                        <div class="input-group py-2">
                            <input v-model="newTodo" type="text" class="form-control input-sm" placeholder="Nouvelle tâche" />
                            <button class="btn btn-success font-weight-bold btn-sm" @click="onAppend">Ajouter</button>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 col-lg-3 py-2 border-start">
                        <h2 class="h6 d-flex justify-content-between">
                            <span>Avancement ({{ progressPercentFormated }})</span> <span>{{ stats.done }}/{{ stats.all }}</span>
                        </h2>
                        <div
                            class="progress"
                            role="progressbar"
                            aria-label="Progression"
                            :aria-valuenow="stats.percent"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            <div class="progress-bar" :style="{ width: stats.percent + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <ul class="nav nav-pills mt-2">
                    <li role="presentation" class="nav-item">
                        <a href="#" class="nav-link" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
                            Toutes ({{ stats.all }})
                        </a>
                    </li>
                    <li role="presentation" class="nav-item ps-0">
                        <a href="#" class="nav-link" :class="{ active: activeTab === 'notDone' }" @click="activeTab = 'notDone'">
                            A faire ({{ stats.notDone }})
                        </a>
                    </li>
                    <li role="presentation" class="nav-item">
                        <a href="#" class="nav-link" :class="{ active: activeTab === 'done' }" @click="activeTab = 'done'">
                            Complétées ({{ stats.done }})
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
        },

        stats() {
            const stats = { all: this.todoStore.todos.length, notDone: 0, done: 0, percent: 0 };

            this.todoStore.todos.forEach((todo) => {
                if (todo.isDone) {
                    stats.done++;
                } else {
                    stats.notDone++;
                }
            });

            stats.percent = (stats.done * 100) / stats.all;

            return stats;
        },

        progressPercentFormated() {
            const number = `${this.stats.percent}`;

            return number.replace('.', ',') + '%';
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
