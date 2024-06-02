<template>
    <div class="modal-backdrop fade show"></div>
    <div id="addModal" class="modal fade show" tabindex="-1" aria-labelledby="addModalLabel">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header bg-light py-2">
                    <h5 id="addModalLabel" class="modal-title">Etiquettes</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>
                <div class="modal-body">
                    <div v-for="editedTag in editedTags" :key="editedTag._id" class="d-flex gap-2 mt-2">
                        <button v-tooltip="'Retirer'" type="button" class="btn ps-0 pe-1" @click="performDelete(editedTag._id)">
                            <i class="bi bi-x-lg text-danger"></i>
                        </button>
                        <div class="input-group">
                            <input v-model="editedTag.name" type="text" class="form-control input-sm border-secondary" />
                            <button
                                v-tooltip="'Enregistrer'"
                                type="button"
                                class="btn btn-secondary btn-sm"
                                @click="onEdit(editedTag._id)"
                            >
                                <i class="bi bi-pencil-fill"></i>
                            </button>
                        </div>
                    </div>
                    <div v-if="isEmpty" class="text-muted text-center">Il n'y a pas d'étiquettes.</div>
                </div>
                <div class="modal-footer bg-light">
                    <div class="input-group py-2">
                        <input v-model="newTag" type="text" class="form-control input-sm" placeholder="Créer une étiquette" />
                        <button v-tooltip="'Ajouter'" class="btn btn-success font-weight-bold btn-sm" @click="onAppend">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import { useTagStore } from '@renderer/stores/tag.js';
import { useTodoStore } from '@renderer/stores/todo.js';
import { mapStores } from 'pinia';
import { createToastify } from '@renderer/utils/toastify.js';
export default {
    name: 'TagModal',

    emits: ['on-close', 'on-refresh'],

    data() {
        return {
            newTag: null,
            editedTags: {}
        };
    },

    computed: {
        ...mapStores(useTagStore, useTodoStore),

        isEmpty() {
            return Object.keys(this.editedTags).length === 0;
        }
    },

    mounted() {
        this.newTag = null;
        this.setData();
    },

    methods: {
        setData() {
            this.editedTags = {};

            for (const key in this.tagStore.tags) {
                const tag = this.tagStore.tags[key];
                this.editedTags[tag._id] = tag;
            }
        },

        close() {
            this.$emit('on-close');
        },

        async onEdit(tagId) {
            if (this.editedTags[tagId].name === null || this.editedTags[tagId].name.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');
                return;
            }
            const status = await this.tagStore.update({ name: this.editedTags[tagId].name }, tagId);
            if (status === false) {
                createToastify("L'opération a échoué.", 'error');
            } else {
                createToastify("L'élément a été modifié.", 'success');
            }
        },

        async onAppend() {
            if (this.newTag === null || this.newTag.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');
                return;
            }

            const status = await this.tagStore.append({ name: this.newTag });
            if (status === false) {
                createToastify("L'opération a échoué.", 'error');
            } else {
                createToastify("L'élément a été ajouté.", 'success');
                this.newTag = null;
                this.setData();
                this.$emit('on-refresh');
            }
        },

        async performDelete(tagId) {
            await this.todoStore.removeTagReference(tagId);
            const status = await this.tagStore.remove(tagId);
            if (status === false) {
                createToastify('Ce tag ne peut être supprimé.', 'error');
            } else {
                createToastify("L'élément a été supprimé.", 'success');
                this.$emit('on-refresh');
            }
            this.setData();
        }
    }
};
</script>
