<template>
    <section class="card shadow-sm">
        <div class="card-header">
            <div class="row align-items-center">
                <div class="col-8">
                    <h2 class="h5 mb-0">Liste des idées</h2>
                </div>
                <div class="col-4 text-end">
                    <button class="btn btn-sm btn-success" @click="onShowEditModal(null)">
                        <i class="bi bi-plus-lg"></i>
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div>
                <div class="row">
                    <div class="col-8 d-flex align-items-center gap-2">
                        <span class="first-label">Statut</span>
                        <VueMultiselect
                            v-model="statusSelected"
                            :options="optionsStatus"
                            :allow-empty="false"
                            :multiple="true"
                            :close-on-select="true"
                            placeholder="Choisir les statuts"
                            select-label="Appuyer sur entrée pour choisir"
                            selected-label="Sélectionné"
                            deselect-label="Appuyer sur entrée pour enlever"
                            label="name"
                            track-by="code"
                            @select="onSelect"
                            @remove="onRemove"
                        />
                    </div>
                    <div class="col-4 text-end">
                        <div class="btn btn-group pe-0">
                            <button
                                v-tooltip="'Réinitialiser les filtres'"
                                type="button"
                                class="btn btn-outline-secondary"
                                @click="reset"
                            >
                                <i class="bi bi-arrow-repeat"></i>
                            </button>
                            <button
                                v-tooltip="'Filtres avancées'"
                                type="button"
                                class="btn btn-outline-secondary"
                                @click="showAdvancedFilters = !showAdvancedFilters"
                            >
                                <i v-if="showAdvancedFilters === false" class="bi bi-eye-fill"></i>
                                <i v-if="showAdvancedFilters === true" class="bi bi-eye-slash-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="showAdvancedFilters" class="row">
                    <div class="col-md-4 d-flex align-items-center gap-2">
                        <label for="daterange" class="first-label">Période</label>
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
                    <div class="col-md-4 d-flex align-items-center gap-2">
                        <label for="daterange">Note</label>
                        <div class="input-group">
                            <span class="input-group-text">Min</span>
                            <input v-model="minNote" min="0" max="5" type="number" class="form-control" />
                            <span class="input-group-text">Max</span>
                            <input v-model="maxNote" min="0" max="5" type="number" class="form-control" />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="dropdown h-100">
                            <button
                                class="btn btn-outline-success h-100 w-100 dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Catégories
                            </button>
                            <div class="dropdown-menu w-100">
                                <div class="form-check ms-2">
                                    <input id="checkAll" v-model="checkAll" class="form-check-input" type="checkbox" />
                                    <label class="form-check-label fw-bold" for="checkAll"> Tout cocher</label>
                                </div>
                                <div class="p-2">
                                    <input
                                        id="search"
                                        v-model="categorySearch"
                                        type="text"
                                        class="form-control"
                                        placeholder="filtrer..."
                                    />
                                </div>
                                <hr class="mb-0 mt-2" size />
                                <div class="categoryContainer pt-2">
                                    <div class="form-check ms-3">
                                        <input
                                            id="check0"
                                            v-model="selectedCategories['0']"
                                            class="form-check-input"
                                            type="checkbox"
                                        />
                                        <label class="form-check-label fw-bold" for="check0">Sans catégorie</label>
                                    </div>
                                    <div v-for="category in categories" :key="category._id" class="form-check ms-3">
                                        <input
                                            :id="'check' + category._id"
                                            v-model="selectedCategories[category._id]"
                                            class="form-check-input"
                                            type="checkbox"
                                        />
                                        <label class="form-check-label" :for="'check' + category._id">
                                            {{ category.name }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="my-3" />
            </div>
            <DataTable :columns="columns" :data="ideas" :options="options" class="table table-index table-hover table-striped">
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
                            <span class="visually-hidden">Supprimer</span>
                        </button>
                    </div>
                </template>
            </DataTable>
        </div>
    </section>
    <IdeaModal v-if="editModal" :idea="idea" @on-close="editModal = false"></IdeaModal>
    <DeleteModal v-if="deleteModal" :title="idea.title" @on-confirm="processDelete" @on-close="deleteModal = false"></DeleteModal>
</template>

<script>
import { mapStores } from 'pinia';
import { useIdeaStore } from '../stores/idea';
import { useCategoryStore } from '../stores/category';
import { createToastify } from '../utils/toastify';
import VueDatePicker from '@vuepic/vue-datepicker';
import { datetimeMixin } from '../utils/datetimeMixin';
import '@vuepic/vue-datepicker/dist/main.css';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import language from '../utils/fr-FR.json';
import IdeaModal from '../components/IdeaModal.vue';
import DeleteModal from '../components/DeleteModal.vue';
import StatusIdea from '../components/StatusIdea.vue';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

DataTable.use(DataTablesCore);

export default {
    name: 'IdeaTable',

    components: {
        DataTable,
        IdeaModal,
        DeleteModal,
        VueDatePicker,
        StatusIdea,
        VueMultiselect
    },

    mixins: [datetimeMixin],

    data() {
        return {
            statusNames: ['en brouillon', 'à faire', 'validé', 'annulé', 'en cours'],
            showAdvancedFilters: false,
            optionsStatus: [],
            statusSelected: {},
            selectedCategories: {},
            categorySearch: null,
            checkAll: true,
            minNote: 0,
            maxNote: 5,
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

        categories() {
            const categories = [];

            for (const key in this.categoryStore.categories) {
                const category = this.categoryStore.categories[key];

                if (this.categorySearch === null || this.categorySearch.length === 0) {
                    categories.push(category);
                } else {
                    if (category.name.toLowerCase().indexOf(this.categorySearch.toLowerCase()) != -1) {
                        categories.push(category);
                    }
                }
            }

            return categories;
        },

        ideas() {
            const status = [];
            for (const key in this.statusSelected) {
                const selected = this.statusSelected[key];
                status.push(selected.code);
            }

            const ideas = [];

            this.ideaStore.ideas.forEach((idea) => {
                let appendTo = true;

                if (this.dates !== null && this.dates.length === 2) {
                    const start = dayjs(this.dates[0]).startOf('day');
                    const end = dayjs(this.dates[1]).endOf('day');
                    appendTo = dayjs(idea.date).isBetween(start, end);
                }

                if (appendTo) {
                    appendTo = status.includes(parseInt(idea.status));
                }

                if (appendTo && this.selectedCategories[idea.category] !== undefined) {
                    appendTo = this.selectedCategories[idea.category] === true;
                } else if (appendTo && idea.category === null) {
                    appendTo = this.selectedCategories['0'] === true;
                }

                if (appendTo) {
                    appendTo = idea.note >= this.minNote && idea.note <= this.maxNote;
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

    watch: {
        checkAll() {
            for (const key in this.selectedCategories) {
                this.selectedCategories[key] = this.checkAll;
            }
        },

        minNote() {
            if (this.minNote > 5) {
                this.minNote = 5;
            } else if (this.minNote < 0) {
                this.minNote = 0;
            }
        },

        maxNote() {
            if (this.maxNote > 5) {
                this.maxNote = 5;
            } else if (this.maxNote < 0) {
                this.maxNote = 0;
            }
        }
    },

    mounted() {
        this.hydrateStatutSelected();
        this.getCategories();
    },

    methods: {
        getStatusInStorage() {
            let selectedFromStorage = localStorage.getItem('status-selected');
            if (selectedFromStorage === null) {
                selectedFromStorage = ['0', '1', '2', '4'];
                localStorage.setItem('status-selected', selectedFromStorage);

                return selectedFromStorage;
            }

            return selectedFromStorage.split(',');
        },

        onSelect(selectedOption) {
            const selectedId = selectedOption.code;
            const currentStorage = this.getStatusInStorage();
            currentStorage.push(`${selectedId}`);
            localStorage.setItem('status-selected', currentStorage);
        },

        onRemove(removedOption) {
            const selectedId = removedOption.code;
            let currentStorage = this.getStatusInStorage();
            currentStorage = currentStorage.filter((e) => e !== `${selectedId}`);
            localStorage.setItem('status-selected', currentStorage);
        },

        getCategories() {
            this.selectedCategories['0'] = true;
            for (const key in this.categoryStore.categories) {
                this.selectedCategories[key] = true;
            }

            this.checkAll = true;
        },

        hydrateStatutSelected() {
            let selectedFromStorage = this.getStatusInStorage();

            this.optionsStatus = [];
            this.statusSelected = [];
            for (let i = 0; i < this.statusNames.length; i++) {
                const option = { name: this.statusNames[i], code: i };
                this.optionsStatus.push(option);

                if (selectedFromStorage.includes(`${i}`)) {
                    this.statusSelected.push(option);
                }
            }
        },

        reset() {
            this.minNote = 0;
            this.maxNote = 5;
            this.dates = null;
            this.checkAll = true;
            this.categorySearch = null;
            for (const key in this.categoryStore.categories) {
                this.selectedCategories[key] = true;
            }

            this.hydrateStatutSelected();
        },

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

table.dataTable th.dt-type-numeric,
table.dataTable th.dt-type-date,
table.dataTable td.dt-type-numeric,
table.dataTable td.dt-type-date {
    text-align: left;
}

.btn-outline-success {
    background-color: #fff;
}

.categoryContainer {
    max-height: 150px;
    overflow-y: scroll;
}

.first-label {
    flex: 0 0 60px;
}
</style>
