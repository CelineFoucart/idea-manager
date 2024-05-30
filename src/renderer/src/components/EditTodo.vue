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
                        <label for="priority" class="form-label required">Priorité</label>
                        <VueMultiselect
                            v-model="priority"
                            :options="priorities"
                            :allow-empty="false"
                            :multiple="false"
                            :close-on-select="true"
                            placeholder="Choisir une priorité"
                            select-label="Appuyer sur entrée pour choisir"
                            selected-label="Sélectionné"
                            deselect-label="Appuyer sur entrée pour enlever"
                            label="label"
                            track-by="value"
                        />
                    </div>

                    <div class="mb-3">
                        <label for="tag">Etiquette</label>
                        <VueMultiselect
                            v-model="tag"
                            :options="tags"
                            :allow-empty="true"
                            :multiple="false"
                            :close-on-select="true"
                            placeholder="Choisir une étiquette"
                            select-label="Appuyer sur entrée pour choisir"
                            selected-label="Sélectionné"
                            deselect-label="Appuyer sur entrée pour enlever"
                            label="name"
                            track-by="_id"
                        />
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
import { useTagStore } from '@renderer/stores/tag.js';
import { createToastify } from '@renderer/utils/toastify.js';
import { mapStores } from 'pinia';
import VueMultiselect from 'vue-multiselect';

export default {
    title: 'EditTodo',

    components: {
        VueMultiselect
    },

    props: {
        data: Object
    },

    emits: ['on-close', 'on-edit'],

    data() {
        return {
            title: null,
            content: null,
            isDone: false,
            tag: null,
            priority: { value: '1', label: 'Priorité basse' }
        };
    },

    computed: {
        ...mapStores(useTagStore),

        priorities() {
            return [
                { value: '1', label: 'Priorité basse' },
                { value: '2', label: 'Priorité moyenne' },
                { value: '3', label: 'Priorité haute' }
            ];
        },

        tags() {
            return Object.values(this.tagStore.tags);
        }
    },

    mounted() {
        this.title = this.data.title;
        this.content = this.data.content;
        this.isDone = this.data.isDone;
        this.priority = this.data.priority ? this.priorities[parseInt(this.data.priority) - 1] : null;
        this.tag = this.data.tag ? this.tagStore.tags[this.data.tag] : null;
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
                priority: this.priority ? this.priority.value : '1',
                tag: this.tag !== null ? this.tag._id : null
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
