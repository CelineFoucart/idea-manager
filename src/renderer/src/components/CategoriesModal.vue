<template>
    <div class="modal-backdrop fade show"></div>
    <div id="addModal" class="modal fade show" tabindex="-1" aria-labelledby="addModalLabel">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header bg-light py-2">
                    <h5 id="addModalLabel" class="modal-title">Catégories</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>
                <div class="modal-body">
                    <p class="fs-5 fw-normal text-muted">Les catégories déjà liées à des idées ne peuvent être supprimées.</p>
                    <div v-for="category in editedCategories" :key="category._id" class="mt-2 input-group input-group-sm">
                        <span class="input-group-text">
                            <i class="bi bi-tag-fill"></i>
                            <label :for="category._id" class="visually-hidden">Nom</label>
                        </span>
                        <input :id="category._id" v-model="category.name" type="text" class="form-control input-sm" />
                        <button v-tooltip="'Editer'" type="button" class="btn btn-success btn-sm" @click="onEdit(category._id)">
                            <i class="bi bi-pencil-fill"></i>
                            <div class="visually-hidden">Editer</div>
                        </button>
                        <button v-tooltip="'Supprimer'" class="btn btn-danger btn-sm" @click="onDelete(category)">
                            <i class="bi bi-trash3-fill"></i>
                            <span class="visually-hidden">Supprimer</span>
                        </button>
                    </div>
                </div>
                <div class="modal-footer bg-light">
                    <div class="input-group input-group-sm mb-0">
                        <span class="input-group-text">
                            <label for="add">Nom</label>
                        </span>
                        <input id="add" v-model="newCategory" type="text" class="form-control" />
                        <button class="btn btn-success" type="button" title="sauvegarder" @click="onAppend">Ajouter</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <DeleteModal
        v-if="openDeleteModal"
        :title="dataToHandle.name"
        :loading="loading"
        @on-close="openDeleteModal = false"
        @on-confirm="performDelete"
    ></DeleteModal>
</template>
<script>
import { useCategoryStore } from '@renderer/stores/category.js';
import { mapStores } from 'pinia';
import { createToastify } from '@renderer/utils/toastify.js';
import DeleteModal from '@renderer/components/DeleteModal.vue';

export default {
    name: 'CategoriesIndex',

    components: {
        DeleteModal
    },

    emits: ['on-refresh', 'on-close'],

    data() {
        return {
            openDeleteModal: false,
            dataToHandle: { name: null },
            loading: false,
            newCategory: null,
            editedCategories: {}
        };
    },

    computed: {
        ...mapStores(useCategoryStore)
    },

    mounted() {
        this.setData();
    },

    methods: {
        close() {
            this.$emit('on-close');
        },

        setData() {
            this.editedCategories = {};

            for (const key in this.categoryStore.categories) {
                const category = this.categoryStore.categories[key];
                this.editedCategories[category._id] = category;
            }
        },

        onDelete(category) {
            this.dataToHandle = category;
            this.openDeleteModal = true;
        },

        async onEdit(category) {
            if (this.editedCategories[category].name === null || this.editedCategories[category].name.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');
                return;
            }

            const status = await this.categoryStore.update({ name: this.name }, this.data._id);
            if (status === false) {
                createToastify("L'opération a échoué", 'error');
            } else {
                createToastify("L'élément a été modifié", 'success');
            }
        },

        async onAppend() {
            if (this.newCategory === null || this.newCategory.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');

                return;
            }

            const status = await this.categoryStore.append({ name: this.newCategory });
            if (status === false) {
                createToastify("L'opération a échoué.", 'error');
            } else {
                createToastify("L'élément a été ajouté.", 'success');
                this.setData();
                this.$emit('on-refresh');
                this.newCategory = null;
            }
        },

        async performDelete() {
            const status = await this.categoryStore.remove(this.dataToHandle._id);
            if (status === false) {
                createToastify('Cette catégorie ne peut être supprimée.', 'error');
            } else {
                createToastify("L'élément a été supprimé.", 'success');
                this.setData();
            }
            this.openDeleteModal = false;
        }
    }
};
</script>
