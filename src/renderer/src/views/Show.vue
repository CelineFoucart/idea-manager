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
                        <StatusIdea :status="ideaStore.idea.status"></StatusIdea>
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

        <div class="bg-white rounded p-2 mt-3 shadow-sm">
            <label for="contentTextarea" class="label-form mb-1 fw-bold">Contenu</label>
            <jodit-editor v-model="content" :buttons="buttons" :config="config" />
            <button type="button" class="btn btn-sm btn-success mt-2" @click="save">Sauvegarder</button>
        </div>
    </article>
</template>

<script lang="js">
import { useIdeaStore } from '../stores/idea';
import { useCategoryStore } from '../stores/category';
import { mapStores } from 'pinia';
import { createToastify } from '../utils/toastify';
import { datetimeMixin } from '../utils/datetimeMixin';
import IdeaModal from '../components/IdeaModal.vue';
import StatusIdea from '../components/StatusIdea.vue';
import 'jodit/build/jodit.min.css';
import { JoditEditor } from 'jodit-vue';

export default {
    name: 'Show',

    components: {
        IdeaModal,
        StatusIdea,
        JoditEditor
    },

    mixins: [datetimeMixin],

    data() {
        return {
            editModal: false,
            content: '',
            config: {
                language: 'fr'
            },
            buttons: [
                'undo',
                'redo',
                'source',
                '|',
                'bold',
                'underline',
                'italic',
                'strikethrough',
                '|',
                'align',
                'indent',
                'outdent',
                'paragraph',
                '|',
                'ul',
                'ol',
                '|',
                'font',
                'fontsize',
                'brush',
                'lineHeight',
                'superscript',
                'subscript',
                '|',
                'image',
                'hr',
                'table',
                'link',
                'symbols',
                '|',
                'cut',
                'copy',
                'paste',
                'selectall',
                'copyformat',
                'eraser',
                '|',
                'find',
                'spellcheck',
                'preview',
                'fullsize'
            ]
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
        const statusCategories = await this.categoryStore.getCategories();
        if (!statusCategories) {
            createToastify('La récupération des catégories a échoué', 'error');
        }

        const ideaId = this.$route.params.id;
        const status = await this.ideaStore.findOne(ideaId);
        if (!status) {
            createToastify("L'idée n'a pas été trouvé", 'error');
            return;
        }

        this.content = this.ideaStore.idea.content ? this.ideaStore.idea.content : '';
    },

    unmounted() {
        this.ideaStore.reset();
    },

    methods: {
        async save() {
            const data = {
                date: this.ideaStore.idea.date,
                title: this.ideaStore.idea.title,
                keywords: this.ideaStore.idea.keywords,
                category: this.ideaStore.idea.category,
                description: this.ideaStore.idea.description,
                content: this.content,
                note: this.ideaStore.idea.note,
                status: this.ideaStore.idea.status,
                sticky: this.ideaStore.idea.sticky
            };

            const status = await this.ideaStore.update(data, this.ideaStore.idea._id);
            if (!status) {
                createToastify('Le formulaire comporte des erreurs.', 'error');
            } else {
                createToastify("L'idée a été sauvegardée.", 'success');
            }
        }
    }
};
</script>

<style>
.jodit-status-bar-link {
    display: none;
}
</style>
