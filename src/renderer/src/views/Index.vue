<template>
    <article>
        <header class="mb-4">
            <h2 class="display-3 fw-normal mb-1">Liste des idées</h2>
            <p class="fs-5 fw-normal text-muted">Retrouvez et fitrez vos idées sur cet onglet.</p>
        </header>

        <aside class="mb-1 text-end">
            <button class="btn btn-sm btn-success">
                <i class="bi bi-plus-lg"></i>
                Ajouter
            </button>
        </aside>

        <div class="card">
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
                </DataTable>
            </div>
        </div>
    </article>
</template>

<script>
import { mapStores } from 'pinia';
import { datetimeMixin } from '../utils/datetimeMixin';
import { useIdeaStore } from '../stores/idea';
import { createToastify } from '../utils/toastify';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import language from '../utils/fr-FR.json';

DataTable.use(DataTablesCore);

export default {
    name: 'Index',

    components: {
        DataTable
    },

    mixins: [datetimeMixin],

    data() {
        return {
            columns: [
                {
                    data: 'date',
                    render(data) {
                        return this.formatDateTime(data);
                    }
                },
                { data: 'title' },
                { data: 'keywords' },
                { data: 'category' },
                { data: 'status' },
                { data: 'note' },
                {
                    data: null,
                    orderable: false,
                    render(_data, _type, row) {
                        `<button type="button" class="btn btn-light border" @click="show(${row._id})">
                            <i class="bi bi-eye"></i>
                        </button>`;
                    }
                }
            ],
            options: { language: language }
        };
    },

    computed: {
        ...mapStores(useIdeaStore),

        ideas() {
            return this.ideaStore.ideas;
        }
    },

    async mounted() {
        const status = await this.ideaStore.getIdeas();
        if (!status) {
            createToastify('La récupération des données a échoué', 'error');
        }
    },

    methods: {
        show(id) {
            console.log(id);
        }
    }
};
</script>

<style>
@import 'datatables.net-bs5';

.card {
    border-color: #dee2e6b0;
}
</style>
