<template>
    <section class="bg-light border my-2 p-3 todo-item">
        <div class="row align-items-center">
            <div class="col-8">
                <header class="form-check">
                    <input :checked="isDone" class="form-check-input" type="checkbox" @click="editIsDone" />
                    <h2 class="h6 form-check-label">
                        <span class="me-2" :class="{ 'todo-complete': isDone }">{{ todo.title }}</span>
                        <span v-if="todo.priority == 1" class="badge text-bg-success">Priorité basse</span>
                        <span v-if="todo.priority == 2" class="badge text-bg-warning">Priorité moyenne</span>
                        <span v-if="todo.priority == 3" class="badge text-bg-danger">Priorité haute</span>
                    </h2>
                </header>
                <div v-if="todo.content !== null" class="small" :class="{ 'todo-complete': isDone }">{{ todo.content }}</div>
            </div>
            <div class="col-4 text-end">
                <div class="btn-group">
                    <button v-tooltip="'Editer'" class="btn btn-primary btn-sm" @click="openEditModal = true">
                        <i class="bi bi-pencil-fill"></i>
                        <span class="visually-hidden">Editer</span>
                    </button>
                    <button v-tooltip="'Supprimer'" class="btn btn-sm btn-danger" @click="openDeleteModal = true">
                        <i class="bi bi-trash-fill"></i>
                        <span class="visually-hidden">Supprimer</span>
                    </button>
                </div>
            </div>
        </div>

        <DeleteModal
            v-if="openDeleteModal"
            :title="todo.title"
            :loading="loading"
            @on-close="openDeleteModal = false"
            @on-confirm="performDelete"
        ></DeleteModal>

        <EditTodo v-if="openEditModal" :data="todo" @on-close="openEditModal = false" @on-edit="performEdit"></EditTodo>
    </section>
</template>

<script>
import DeleteModal from '@renderer/components/DeleteModal.vue';
import { useTodoStore } from '@renderer/stores/todo.js';
import { mapStores } from 'pinia';
import { createToastify } from '@renderer/utils/toastify.js';
import EditTodo from './EditTodo.vue';

export default {
    name: 'TodoItem',

    components: {
        DeleteModal,
        EditTodo
    },

    props: {
        todo: Object
    },

    data() {
        return {
            isDone: false,
            loading: false,
            openDeleteModal: false,
            openEditModal: false
        };
    },

    computed: {
        ...mapStores(useTodoStore)
    },

    mounted() {
        this.isDone = this.todo.isDone;
    },

    methods: {
        async performDelete() {
            const status = await this.todoStore.remove(this.todo._id);
            if (status === false) {
                createToastify('La suppression a échoué.', 'error');
            } else {
                createToastify("L'élément a été supprimé.", 'success');
            }

            this.openDeleteModal = false;
        },

        async editIsDone() {
            this.isDone = !this.isDone;

            const data = {
                title: this.todo.title,
                content: this.todo.content,
                isDone: this.isDone,
                priority: this.todo.priority
            };

            await this.performEdit(data);
        },

        async performEdit(data) {
            const status = await this.todoStore.update(data, this.todo._id);
            if (status === false) {
                createToastify("L'opération a échoué", 'error');
            } else {
                createToastify("L'élément a été modifié", 'success');
                this.openEditModal = false;
            }
        }
    }
};
</script>

<style scoped>
.todo-complete {
    text-decoration: line-through;
}
</style>
