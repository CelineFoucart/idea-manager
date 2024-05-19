<template>
    <article>
        <header class="mb-4">
            <h2 class="display-3 fw-normal mb-1">Liste des idées</h2>
            <p class="fs-5 fw-normal text-muted">Retrouvez et fitrez vos idées sur cet onglet.</p>
        </header>

        <aside class="mb-1 text-end">
            <button class="btn btn-sm btn-success" @click="onShowEditModal(null)">
                <i class="bi bi-plus-lg"></i>
                Ajouter
            </button>
        </aside>

        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-md-6">
                        <!-- filtre par date -->
                    </div>
                    <div class="col-md-6">
                        <!-- filtre note, statut, categ -->
                    </div>
                </div>
            </div>
            <div class="card-body">
                <DataTable
                    :columns="columns"
                    :data="ideas"
                    :options="options"
                    class="table table-index table-hover table-striped"
                >
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Titre</th>
                            <th>Mots clés</th>
                            <th>Catégories</th>
                            <th>Statut</th>
                            <th>Note</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <template #column-date="props">
                        {{ formatDateTime(props.cellData) }}
                    </template>
                    <template #column-status="props">
                        <span v-if="parseInt(props.cellData) >= 0 || parseInt(props.cellData) < 4">
                            {{ statusNames[parseInt(props.cellData)] }}
                        </span>
                    </template>
                    <template #column-note="props">
                        <span v-tooltip="props.cellData + '/ 5'">
                            <i v-for="index in parseInt(props.cellData)" :key="index" class="bi bi-star-fill"></i>
                            <i v-for="index in 5 - parseInt(props.cellData)" :key="index" class="bi bi-star"></i>
                            <span class="visually-hidden">{{ props.cellData }} / 5</span>
                        </span>
                    </template>
                    <template #column-actions="props">
                        <div class="btn-group">
                            <button v-tooltip="'Voir'" class="btn btn-sm btn-primary" @click="show(props.cellData)">
                                <i class="bi bi-eye"></i>
                                <span class="visually-hidden">Voir</span>
                            </button>
                            <button v-tooltip="'Editer'" class="btn btn-sm btn-success" @click="onShowEditModal(props.rowData)">
                                <i class="bi bi-pencil-fill"></i>
                                <span class="visually-hidden">Editer</span>
                            </button>
                            <button v-tooltip="'Supprimer'" class="btn btn-sm btn-danger" @click="onShowDelete(props.rowData)">
                                <i class="bi bi-trash3-fill"></i>
                                <span class="visually-hidden">Voir</span>
                            </button>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
        <IdeaModal v-if="editModal" :idea="idea" @on-close="editModal = false"></IdeaModal>
        <DeleteModal
            v-if="deleteModal"
            :title="idea.title"
            @on-confirm="processDelete"
            @on-close="deleteModal = false"
        ></DeleteModal>
    </article>
</template>

<script>
import { mapStores } from 'pinia';
import { datetimeMixin } from '../utils/datetimeMixin';
import { useIdeaStore } from '../stores/idea';
import { useCategoryStore } from '../stores/category';
import { createToastify } from '../utils/toastify';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import language from '../utils/fr-FR.json';
import IdeaModal from '../components/IdeaModal.vue';
import DeleteModal from '../components/DeleteModal.vue';

DataTable.use(DataTablesCore);

export default {
    name: 'Index',

    components: {
        DataTable,
        IdeaModal,
        DeleteModal
    },

    mixins: [datetimeMixin],

    data() {
        return {
            statusNames: ['en brouillon', 'à faire', 'validé', 'annulé'],
            columns: [
                { data: 'date', name: 'date' },
                { data: 'title', name: 'title' },
                { data: 'keywords', name: 'keywords' },
                { data: 'categoryName', name: 'categoryName' },
                { data: 'status', name: 'status' },
                { data: 'note', name: 'note' },
                { data: '_id', name: 'actions', orderable: false }
            ],
            options: { language: language },
            idea: null,
            editModal: false,
            deleteModal: false
        };
    },

    computed: {
        ...mapStores(useIdeaStore, useCategoryStore),

        ideas() {
            const ideas = [];

            this.ideaStore.ideas.forEach((idea) => {
                if (this.categories[idea.category]) {
                    idea.categoryName = this.categories[idea.category].name;
                } else {
                    idea.categoryName = null;
                }

                ideas.push(idea);
            });

            return ideas;
        },

        categories() {
            const categories = {};

            this.categoryStore.categories.forEach((category) => {
                categories[category._id] = category;
            });

            return categories;
        }
    },

    async mounted() {
        const status = await this.ideaStore.getIdeas();
        if (!status) {
            createToastify('La récupération des données a échoué', 'error');
        }

        const statusCategories = await this.categoryStore.getCategories();
        if (!statusCategories) {
            createToastify('La récupération des catégories a échoué', 'error');
        }
    },

    methods: {
        show(id) {
            console.log(id);
        },

        onShowEditModal(idea = null) {
            this.idea = idea !== null ? idea : null;
            this.editModal = true;
        },

        onShowDelete(idea) {
            this.idea = idea;
            this.deleteModal = true;
        },

        async processDelete() {
            const status = await this.ideaStore.remove(this.idea._id);
            if (status) {
                createToastify("L'idée a été supprimée.", 'success');
                this.deleteModal = false;
                this.idea = null;
            } else {
                createToastify('La suppression a échoué.', 'error');
            }
        }
    }
};
</script>

<style>
@import 'datatables.net-bs5';

.card,
.card-header {
    border-color: #dee2e6b0;
}
</style>
