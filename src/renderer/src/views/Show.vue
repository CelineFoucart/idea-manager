<template>
    <article v-if="ideaStore.idea !== null">
        <header class="bg-white rounded p-2 shadow-sm">
            <div class="row">
                <div class="col-8">
                    <h1 class="mb-0 border-bottom pb-1">
                        {{ ideaStore.idea.title }}
                        <i
                            v-tooltip="'Editer'"
                            class="bi bi-pencil-fill text-success h4"
                            role="button"
                            @click="editModal = true"
                        ></i>
                    </h1>
                    <p class="pt-1 text-muted small ps-1">
                        <i class="bi bi-bookmark-fill"></i>
                        {{ ideaStore.idea.keywords }}
                    </p>
                </div>
                <div class="col-4 text-end">
                    <div>
                        <span v-if="categoryName" class="badge text-bg-light border">
                            <i class="bi bi-tag-fill"></i> {{ categoryName }}
                        </span>
                        <span v-if="statusName !== null" class="badge ms-1" :class="statusColor">
                            <i v-if="ideaStore.idea.status == 0" class="bi bi-pencil-square"></i>
                            <i v-if="ideaStore.idea.status == 1" class="bi bi-check2-square"></i>
                            <i v-if="ideaStore.idea.status == 2" class="bi bi-check-lg"></i>
                            <i v-if="ideaStore.idea.status == 3" class="bi bi-x-lg"></i>
                            {{ statusName }}
                        </span>
                    </div>
                    <div class="pt-1 text-muted small">
                        <i class="bi bi-calendar-fill"></i>
                        {{ formatDateTime(ideaStore.idea.date) }}
                    </div>
                </div>
                <div class="col-12">
                    <p style="white-space: pre-wrap" class="text-muted">
                        {{ ideaStore.idea.description }}
                        <span v-if="ideaStore.idea.description === null" class="fst-italic small">Aucune description</span>
                    </p>
                    <span v-tooltip="ideaStore.idea.note + '/ 5'">
                        <i v-for="index in parseInt(ideaStore.idea.note)" :key="index" class="bi bi-star-fill"></i>
                        <i v-for="index in 5 - parseInt(ideaStore.idea.note)" :key="index" class="bi bi-star"></i>
                        <span class="visually-hidden">{{ ideaStore.idea.note }} / 5</span>
                    </span>
                </div>
            </div>
            <IdeaModal v-if="editModal" :idea="ideaStore.idea" @on-close="editModal = false"></IdeaModal>
        </header>

        <div class="bg-white rounded p-2 mt-3 shadow-sm">contenu ici</div>
    </article>
</template>

<script>
import { useIdeaStore } from '../stores/idea';
import { useCategoryStore } from '../stores/category';
import { mapStores } from 'pinia';
import { createToastify } from '../utils/toastify';
import { datetimeMixin } from '../utils/datetimeMixin';
import IdeaModal from '../components/IdeaModal.vue';

export default {
    name: 'Show',

    components: {
        IdeaModal
    },

    mixins: [datetimeMixin],

    data() {
        return {
            editModal: false
        };
    },

    computed: {
        ...mapStores(useIdeaStore, useCategoryStore),

        categoryName() {
            if (this.ideaStore.category === null) {
                return null;
            }

            if (this.categoryStore.categories[this.ideaStore.idea.category]) {
                return this.categoryStore.categories[this.ideaStore.idea.category].name;
            }

            return null;
        },

        statusName() {
            const statusNames = ['en brouillon', 'à faire', 'validé', 'annulé'];

            if (parseInt(this.ideaStore.idea.status) >= 0 || parseInt(this.ideaStore.idea.status) < 4) {
                return statusNames[parseInt(this.ideaStore.idea.status)];
            }

            return null;
        },

        statusColor() {
            const status = this.ideaStore.idea.status;

            if (status == 0) {
                return 'text-bg-secondary';
            } else if (status == 1) {
                return 'text-bg-primary';
            } else if (status == 2) {
                return 'text-bg-success';
            } else {
                return 'text-bg-danger';
            }
        }
    },

    async mounted() {
        const ideaId = this.$route.params.id;
        const status = await this.ideaStore.findOne(ideaId);
        if (!status) {
            createToastify("L'idée n'a pas été trouvé", 'error');
        }
    }
};
</script>
