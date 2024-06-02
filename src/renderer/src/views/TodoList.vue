<template>
    <article>
        <header class="mb-5">
            <div class="row align-items-center">
                <div class="col-7">
                    <h1 class="display-3 fw-normal mb-1">Liste des tâches</h1>
                </div>
                <div class="col-5 text-end">
                    <button type="button" class="btn btn-dark" @click="openTagModal = true">
                        <i class="bi bi-tag-fill"></i>
                        Etiquettes
                    </button>
                </div>
            </div>
        </header>
        <TagModal v-if="openTagModal" @on-refresh="refreshTagsSelected" @on-close="openTagModal = false"></TagModal>

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
                <div class="row">
                    <div class="col-6">
                        <ul class="nav nav-pills mt-2">
                            <li role="presentation" class="nav-item">
                                <a href="#" class="nav-link" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
                                    Toutes ({{ stats.all }})
                                </a>
                            </li>
                            <li role="presentation" class="nav-item ps-0">
                                <a
                                    href="#"
                                    class="nav-link"
                                    :class="{ active: activeTab === 'notDone' }"
                                    @click="activeTab = 'notDone'"
                                >
                                    A faire ({{ stats.notDone }})
                                </a>
                            </li>
                            <li role="presentation" class="nav-item">
                                <a
                                    href="#"
                                    class="nav-link"
                                    :class="{ active: activeTab === 'done' }"
                                    @click="activeTab = 'done'"
                                >
                                    Complétées ({{ stats.done }})
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="col-6 align-items-center justify-content-end gap-1 d-flex">
                        <strong>Filtres :</strong>
                        <div class="dropdown">
                            <button
                                class="btn btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Etiquettes
                            </button>
                            <ul class="dropdown-menu">
                                <li class="border-bottom">
                                    <span class="dropdown-item">
                                        <div class="mb-3">
                                            <label for="searchTag" class="fw-bold">Filtrer</label>
                                            <input id="searchTag" v-model="queryTag" type="text" class="form-control" />
                                        </div>
                                    </span>
                                </li>
                                <li id="tag-container" class="bg-light">
                                    <span class="dropdown-item">
                                        <div v-for="tag in tags" :key="tag._id" class="form-check">
                                            <input
                                                :id="tag._id"
                                                v-model="selectedTags[tag._id]"
                                                class="form-check-input"
                                                type="checkbox"
                                            />
                                            <label class="form-check-label" for="checkAll">{{ tag.name }}</label>
                                        </div>
                                    </span>
                                </li>
                                <li class="border-top">
                                    <span class="dropdown-item">
                                        <div class="form-check">
                                            <input id="noTag" v-model="noTag" class="form-check-input" type="checkbox" />
                                            <label class="form-check-label fw-bold" for="checkAll">Sans étiquette</label>
                                        </div>
                                        <div class="form-check">
                                            <input
                                                id="checkAll"
                                                v-model="checkAllTags"
                                                class="form-check-input"
                                                type="checkbox"
                                            />
                                            <label class="form-check-label fw-bold" for="checkAll">Tout cocher</label>
                                        </div>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown">
                            <button
                                class="btn btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Priorités
                            </button>
                            <ul class="dropdown-menu">
                                <li><h6 class="dropdown-header">Afficher</h6></li>
                                <li>
                                    <span class="dropdown-item">
                                        <div class="form-check">
                                            <input id="one" v-model="priorityOne" class="form-check-input" type="checkbox" />
                                            <label class="form-check-label badge text-bg-success" for="one">
                                                Priorité basse
                                            </label>
                                        </div>
                                    </span>
                                </li>
                                <li>
                                    <span class="dropdown-item">
                                        <div class="form-check">
                                            <input id="two" v-model="priorityTwo" class="form-check-input" type="checkbox" />
                                            <label class="form-check-label badge text-bg-warning" for="two">
                                                Priorité moyenne
                                            </label>
                                        </div>
                                    </span>
                                </li>
                                <li>
                                    <span class="dropdown-item">
                                        <div class="form-check">
                                            <input id="three" v-model="priorityThree" class="form-check-input" type="checkbox" />
                                            <label class="form-check-label badge text-bg-danger" for="three">
                                                Priorité haute
                                            </label>
                                        </div>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="my-2">
                    <TodoItem v-for="todo in todos" :key="todo._id" :todo="todo"></TodoItem>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import TodoItem from '@renderer/components/TodoItem.vue';
import TagModal from '@renderer/components/TagModal.vue';
import { useTodoStore } from '@renderer/stores/todo.js';
import { useTagStore } from '@renderer/stores/tag.js';
import { mapStores } from 'pinia';
import { createToastify } from '@renderer/utils/toastify.js';

export default {
    name: 'TodoList',

    components: {
        TodoItem,
        TagModal
    },

    data() {
        return {
            activeTab: 'all',
            newTodo: null,
            priorityOne: true,
            priorityTwo: true,
            priorityThree: true,
            openTagModal: false,
            checkAllTags: true,
            queryTag: null,
            selectedTags: {},
            noTag: true
        };
    },

    computed: {
        ...mapStores(useTodoStore, useTagStore),

        todos() {
            const todos = [];

            for (let i = 0; i < this.todoStore.todos.length; i++) {
                const todo = this.todoStore.todos[i];

                if (this.priorityOne === false && todo.priority == 1) {
                    continue;
                }
                if (this.priorityTwo === false && todo.priority == 2) {
                    continue;
                }
                if (this.priorityThree === false && todo.priority == 3) {
                    continue;
                }
                if (todo.tag !== null && this.selectedTags[todo.tag] !== true) {
                    continue;
                }
                if (todo.tag === null && this.noTag === false) {
                    continue;
                }
                if (this.activeTab === 'all') {
                    todos.push(todo);
                } else if (this.activeTab === 'notDone' && todo.isDone === false) {
                    todos.push(todo);
                } else if (this.activeTab === 'done' && todo.isDone === true) {
                    todos.push(todo);
                }
            }

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

        tags() {
            const tags = [];

            for (const key in this.tagStore.tags) {
                const tag = this.tagStore.tags[key];
                if (this.queryTag === null || this.queryTag.length < 1) {
                    tags.push(tag);
                } else {
                    if (tag.name.toLowerCase().indexOf(this.queryTag.toLowerCase()) != -1) {
                        tags.push(tag);
                    }
                }
            }

            return tags;
        },

        progressPercentFormated() {
            const number = this.stats.percent.toFixed(2);
            if (isNaN(number)) {
                return '0,00%';
            }

            return number.replace('.', ',') + '%';
        }
    },

    watch: {
        checkAllTags() {
            for (const key in this.selectedTags) {
                this.selectedTags[key] = this.checkAllTags;
            }
        }
    },

    async mounted() {
        const status = await this.todoStore.getAll();

        if (status === false) {
            createToastify('Le chargement des tâches a échoué.', 'error');
        }

        const statusTag = await this.tagStore.getAll();
        if (statusTag === false) {
            createToastify('Le chargement des étiquettes a échoué.', 'error');
        }

        this.refreshTagsSelected();
    },

    methods: {
        refreshTagsSelected() {
            this.selectedTags = {};
            for (const key in this.tagStore.tags) {
                const tag = this.tagStore.tags[key];
                this.selectedTags[tag._id] = true;
            }
        },

        async onAppend() {
            if (this.newTodo === null || this.newTodo.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');
                return;
            }

            const newTodo = {
                title: this.newTodo,
                content: null,
                isDone: false,
                tag: null,
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

<style>
#tag-container {
    max-width: 300px;
    overflow-y: scroll;
}
</style>
