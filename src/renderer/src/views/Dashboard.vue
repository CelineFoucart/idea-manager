<template>
    <article>
        <header class="mb-4">
            <h1 class="display-3 fw-normal mb-1">Tableau de bord</h1>
        </header>
        <div class="row g-2">
            <div v-for="idea in ideaStore.ideas" :key="idea._id" class="col-md-6 col-lg-4">
                <section class="bg-light rounded h-100 bg-white shadow-sm p-3 position-relative">
                    <StatusIdea :status="idea.status"></StatusIdea>
                    <h2 class="h5 mb-0 mt-1">
                        <router-link
                            :to="{ name: 'idea_show', params: { id: idea._id } }"
                            class="text-decoration-none stretched-link"
                        >
                            <i class="bi bi-pin-angle-fill"></i> {{ idea.title }}
                        </router-link>
                    </h2>
                    <p style="white-space: pre-wrap" class="mb-0">{{ substract(idea.description) }}</p>
                </section>
            </div>

            <div class="col-12 text-center pt-3">
                <router-link :to="{ name: 'idea_index' }" class="btn btn-lg btn-outline-dark rounded-pill">
                    <i class="bi bi-table"></i>
                    Voir mes idées
                </router-link>
                <button type="button" class="ms-2 btn btn-lg btn-outline-dark rounded-pill" @click="editModal = true">
                    <i class="bi bi-plus-lg"></i>
                    Ajouter une idée
                </button>
            </div>
            <IdeaModal v-if="editModal" :idea="null" @on-close="editModal = false"></IdeaModal>
        </div>
    </article>
</template>

<script>
import { datetimeMixin } from '../utils/datetimeMixin';
import { mapStores } from 'pinia';
import { useIdeaStore } from '../stores/idea';
import { useCategoryStore } from '../stores/category';
import { createToastify } from '../utils/toastify';
import StatusIdea from '../components/StatusIdea.vue';
import IdeaModal from '../components/IdeaModal.vue';

export default {
    name: 'Dashboard',

    components: {
        StatusIdea,
        IdeaModal
    },

    mixins: [datetimeMixin],

    data() {
        return {
            editModal: false
        };
    },

    computed: {
        ...mapStores(useIdeaStore, useCategoryStore)
    },

    async mounted() {
        this.ideaStore.setOnlySticky(true);
        const status = await this.ideaStore.getIdeas({ sticky: true });
        if (!status) {
            createToastify('La récupération des données a échoué.', 'error');
        }
    },

    unmounted() {
        this.ideaStore.reset();
    },

    methods: {
        substract(value) {
            if (value === null) {
                return '';
            } else if (value.length <= 150) {
                return value;
            }

            let cutString = value.substring(0, 150);
            cutString = cutString.substr(0, Math.min(cutString.length, cutString.lastIndexOf(' ')));
            return cutString + '[...]';
        }
    }
};
</script>
