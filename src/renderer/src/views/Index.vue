<template>
    <article>
        <header class="mb-4">
            <div class="row align-items-center">
                <div class="col-7">
                    <h1 class="display-3 mb-0 fw-normal mb-1">Liste des idées</h1>
                </div>
                <div class="col-5 text-end">
                    <button type="button" class="btn btn-dark" @click="openCategoriesModal = true">
                        <i class="bi bi-tag-fill"></i>
                        Catégories
                    </button>
                </div>
                <div class="col-12">
                    <p class="fs-5 fw-normal text-muted">Retrouvez et fitrez les idées que vous avez ajoutées à l'application.</p>
                </div>
            </div>
            <CategoriesModal v-if="openCategoriesModal" @on-close="openCategoriesModal = false" />
        </header>

        <div v-if="loading === false">
            <ul class="nav nav-tabs mx-2 border-bottom-0">
                <li class="nav-item">
                    <button type="button" class="nav-link" :class="{ active: tabs.list === true }" @click="toggleTabs('list')">
                        <i class="bi bi-table"></i> Listes des idées
                    </button>
                </li>
                <li class="nav-item">
                    <button type="button" class="nav-link" :class="{ active: tabs.stats === true }" @click="toggleTabs('stats')">
                        <i class="bi bi-bar-chart-line-fill"></i> Statistiques
                    </button>
                </li>
            </ul>
            <IdeaTable v-if="tabs.list === true"></IdeaTable>
            <Statistics v-if="tabs.stats === true"></Statistics>
        </div>
    </article>
</template>

<script>
import { mapStores } from 'pinia';
import { useIdeaStore } from '../stores/idea';
import { useCategoryStore } from '../stores/category';
import { createToastify } from '../utils/toastify';
import CategoriesModal from '../components/CategoriesModal.vue';
import IdeaTable from '../components/IdeaTable.vue';
import Statistics from '../components/Statistics.vue';

export default {
    name: 'Index',

    components: {
        CategoriesModal,
        IdeaTable,
        Statistics
    },

    data() {
        return {
            openCategoriesModal: false,
            tabs: { list: true, stats: false },
            loading: true
        };
    },

    computed: {
        ...mapStores(useIdeaStore, useCategoryStore)
    },

    async mounted() {
        this.loading = true;
        this.ideaStore.setOnlySticky(false);
        const status = await this.ideaStore.getIdeas();
        if (!status) {
            createToastify('La récupération des idées a échoué', 'error');
        }

        const statusCategories = await this.categoryStore.getCategories();
        if (!statusCategories) {
            createToastify('La récupération des catégories a échoué', 'error');
        }
        this.loading = false;
    },

    unmounted() {
        this.ideaStore.reset();
    },

    methods: {
        toggleTabs(target) {
            this.tabs.list = false;
            this.tabs.stats = false;
            this.tabs[target] = true;
        }
    }
};
</script>
