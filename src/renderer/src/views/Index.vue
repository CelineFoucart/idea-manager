<template>
    <article>
        <header class="mb-4">
            <h1 class="display-3 fw-normal mb-1">Liste des idées</h1>
            <p class="fs-5 fw-normal text-muted">Retrouvez et fitrez les idées que vous avez ajouté à l'application.</p>
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
                    <div class="col-md-4 d-flex align-items-center gap-2">
                        <label for="daterange" class="fw-bold">Période</label>
                        <VueDatePicker
                            id="daterange"
                            v-model="dates"
                            locale="fr"
                            :format="format"
                            auto-apply
                            :enable-time-picker="false"
                            range
                        ></VueDatePicker>
                    </div>
                    <div class="col-md-8">
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
                        <div class="d-none">{{ props.cellData }}</div>
                        {{ formatDateTime(props.cellData) }}
                    </template>
                    <template #column-status="props">
                        <StatusIdea :status="props.cellData"></StatusIdea>
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
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
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import StatusIdea from '../components/StatusIdea.vue';
dayjs.extend(isBetween);

DataTable.use(DataTablesCore);

export default {
    name: 'Index',

    components: {
        DataTable,
        IdeaModal,
        DeleteModal,
        VueDatePicker,
        StatusIdea
    },

    mixins: [datetimeMixin],

    data() {
        return {
            statusNames: ['en brouillon', 'à faire', 'validé', 'annulé'],
            dates: null,
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
                let appendTo = true;

                if (this.dates !== null && this.dates.length === 2) {
                    const start = dayjs(this.dates[0]).startOf('day');
                    const end = dayjs(this.dates[1]).endOf('day');
                    appendTo = dayjs(idea.date).isBetween(start, end);
                }

                if (appendTo) {
                    if (this.categoryStore.categories[idea.category]) {
                        idea.categoryName = this.categoryStore.categories[idea.category].name;
                    } else {
                        idea.categoryName = null;
                    }

                    ideas.push(idea);
                }
            });

            return ideas;
        }
    },

    async mounted() {
        this.ideaStore.setOnlySticky(false);
        const status = await this.ideaStore.getIdeas();
        if (!status) {
            createToastify('La récupération des données a échoué', 'error');
        }

        const statusCategories = await this.categoryStore.getCategories();
        if (!statusCategories) {
            createToastify('La récupération des catégories a échoué', 'error');
        }
    },

    unmounted() {
        this.ideaStore.reset();
    },

    methods: {
        show(id) {
            this.$router.push('/ideas/' + id);
        },

        format(dates) {
            const start = dayjs(dates[0]).format('DD/MM/YYYY');
            const end = dayjs(dates[1]).format('DD/MM/YYYY');
            return start + ' - ' + end;
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
