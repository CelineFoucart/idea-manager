<template>
    <article>
        <header class="mb-5">
            <h1 class="display-3 fw-normal mb-1">Catégories</h1>
            <p class="fs-5 fw-normal text-muted">Les catégories déjà liées à des idées ne peuvent être supprimées.</p>
        </header>

        <section class="card shadow-sm">
            <header class="card-header py-2">
                <div class="row">
                    <div class="col-md-7">
                        <h2 class="m-0 font-weight-bold text-primary h4">Liste des catégories</h2>
                    </div>
                    <div class="col-md-5">
                        <div class="input-group input-group-sm mb-0">
                            <span class="input-group-text">
                                <label for="add">Nom</label>
                            </span>
                            <input id="add" v-model="newCategory" type="text" class="form-control" />
                            <button class="btn btn-success" type="button" title="sauvegarder" @click="onAppend">Ajouter</button>
                        </div>
                    </div>
                </div>
            </header>
            <div class="card-body">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th class="text-gray col-md-8 col-lg-9">Nom</th>
                            <th class="text-gray col-md-4 col-lg-9">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in categoryStore.categories" :key="category._id">
                            <td>{{ category.name }}</td>
                            <td>
                                <div class="btn-group">
                                    <button v-tooltip="'Editer'" class="btn btn-primary btn-sm" @click="onEdit(category)">
                                        <i class="bi bi-pencil-fill"></i>
                                        <span class="visually-hidden">Editer</span>
                                    </button>
                                    <button v-tooltip="'Supprimer'" class="btn btn-danger btn-sm" @click="onDelete(category)">
                                        <i class="bi bi-trash3-fill"></i>
                                        <span class="visually-hidden">Supprimer</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <DeleteModal
            v-if="openDeleteModal"
            :title="dataToHandle.name"
            :loading="loading"
            @on-close="openDeleteModal = false"
            @on-confirm="performDelete"
        >
        </DeleteModal>
        <EditCategory v-if="openEditModal" :data="dataToHandle" @on-close="openEditModal = false"></EditCategory>
    </article>
</template>

<script>
import { useCategoryStore } from '@renderer/stores/category.js';
import { mapStores } from 'pinia';
import { createToastify } from '@renderer/utils/toastify.js';
import DeleteModal from '@renderer/components/DeleteModal.vue';
import EditCategory from '@renderer/components/EditCategory.vue';

export default {
    name: 'CategoriesIndex',

    components: {
        DeleteModal,
        EditCategory
    },

    data() {
        return {
            openDeleteModal: false,
            openEditModal: false,
            dataToHandle: { name: null },
            loading: false,
            newCategory: null
        };
    },

    computed: {
        ...mapStores(useCategoryStore)
    },

    async mounted() {
        const status = await this.categoryStore.getCategories();

        if (status === false) {
            createToastify('Le chargement des catégories a échoué.', 'error');
        }
    },

    methods: {
        onDelete(category) {
            this.dataToHandle = category;
            this.openDeleteModal = true;
        },

        onEdit(record) {
            this.dataToHandle = record;
            this.openEditModal = true;
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
                this.newCategory = null;
            }
        },

        async performDelete() {
            const status = await this.categoryStore.remove(this.dataToHandle._id);
            if (status === false) {
                createToastify('Cette catégorie ne peut être supprimée.', 'error');
            } else {
                createToastify("L'élément a été supprimé.", 'success');
            }
            this.openDeleteModal = false;
        }
    }
};
</script>
