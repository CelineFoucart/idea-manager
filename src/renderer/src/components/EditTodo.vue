<template>
    <div class="modal-backdrop fade show"></div>
    <div id="addModal" class="modal fade show" tabindex="-1" aria-labelledby="addModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header py-2">
                    <h5 id="addModalLabel" class="modal-title">Tâche</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="title" class="required">Titre</label>
                        <input id="title" v-model="title" type="text" class="form-control" />
                    </div>

                    <div class="mb-3">
                        <label for="priority" class="form-label">Priorité</label>
                        <select id="priority" v-model="priority" class="form-select">
                            <option value="1">Priorité basse</option>
                            <option value="2">Priorité moyenne</option>
                            <option value="3">Priorité haute</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="content" class="required">Description</label>
                        <textarea id="content" v-model="content" type="text" class="form-control"></textarea>
                    </div>

                    <div class="form-check">
                        <input id="isDone" v-model="isDone" class="form-check-input" type="checkbox" />
                        <label for="isDone" class="form-check-label">Marquée comme faite</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" @click="close">Annuler</button>
                    <button type="button" class="btn btn-success btn-sm" data-bs-dismiss="modal" @click.prevent="save">
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createToastify } from '@renderer/utils/toastify.js';

export default {
    title: 'EditTodo',

    props: {
        data: Object
    },

    emits: ['on-close', 'on-edit'],

    data() {
        return {
            title: null,
            content: null,
            isDone: false,
            priority: 1
        };
    },

    mounted() {
        this.title = this.data.title;
        this.content = this.data.content;
        this.isDone = this.data.isDone;
        this.priority = this.data.priority;
    },

    methods: {
        close() {
            this.$emit('on-close');
        },

        async save() {
            if (this.title === null || this.title.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');
            }

            const data = {
                title: this.title,
                content: this.content,
                isDone: this.isDone,
                priority: this.priority
            };

            this.$emit('on-edit', data);
        }
    }
};
</script>

<style>
#addModal {
    display: block;
    z-index: 3000;
}
</style>
