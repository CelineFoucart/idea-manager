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
            <textarea id="contentTextarea" v-model="content"></textarea>
            <button type="button" class="btn btn-sm btn-success mt-2" @click="save">Sauvegarder</button>
        </div>
    </article>
</template>

<script>
import { useIdeaStore } from '../stores/idea';
import { useCategoryStore } from '../stores/category';
import { mapStores } from 'pinia';
import { createToastify } from '../utils/toastify';
import { datetimeMixin } from '../utils/datetimeMixin';
import IdeaModal from '../components/IdeaModal.vue';
import StatusIdea from '../components/StatusIdea.vue';
import tinymce from 'tinymce';

export default {
    name: 'Show',

    components: {
        IdeaModal,
        StatusIdea
    },

    mixins: [datetimeMixin],

    data() {
        return {
            editModal: false,
            content: null
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

        this.content = this.ideaStore.idea.content;
        tinymce.init({
            selector: '#contentTextarea',
            license_key: 'gpl',
            language: 'fr_FR',
            highlight_on_focus: false,
            skin: 'tinymce-5',
            branding: false,
            promotion: false,
            insertdatetime_formats: ['%H:%M:%S', '%d/%m/%Y', '%d/%m/%Y %H:%M:%S'],
            quickbars_insert_toolbar: 'quicktable quicklink | hr pagebreak | bullist numlist',
            contextmenu:
                'alignleft aligncenter alignright alignjustify | bold italic underline strikethrough | forecolor backcolor fontsizes | image link table | selectall cut copy paste removeformat',
            quickbars_selection_toolbar: 'bold italic underline strikethrough bullist quicklink blockquote quicktable',
            toolbar:
                'undo redo |' +
                'blocks | fontsizeinput | bold italic underline strikethrough align | bullist numlist blockquote link quicktable |' +
                'lineheight  outdent indent | forecolor backcolor |' +
                'removeformat fullscreen help',
            menu: {
                file: {
                    title: 'File',
                    items: 'code wordcount | visualaid visualchars visualblocks | preview fullscreen | newdocument print '
                },
                edit: { title: 'Edit', items: 'undo redo | cut copy paste removeformat | selectall | searchreplace' },
                insert: {
                    title: 'Insert',
                    items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime'
                },
                format: {
                    title: 'Format',
                    items: 'bold italic underline strikethrough superscript subscript codeformat | blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat'
                },
                table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' }
            },
            menubar: 'file format edit insert table',
            plugins: [
                'advlist',
                'anchor',
                'autolink',
                'charmap',
                'fullscreen',
                'help',
                'image',
                'importcss',
                'link',
                'lists',
                'media',
                'nonbreaking',
                'preview',
                'quickbars',
                'searchreplace',
                'table',
                'visualblocks',
                'visualchars',
                'wordcount',
                'emoticons',
                'insertdatetime'
            ]
        });
    },

    unmounted() {
        tinymce.activeEditor.destroy();
        this.ideaStore.reset();
    },

    methods: {
        async save() {
            this.content = tinymce.activeEditor.getContent('contentTextarea');
            const data = {
                date: this.ideaStore.idea.date,
                title: this.ideaStore.idea.title,
                keywords: this.ideaStore.idea.keywords,
                category: this.ideaStore.idea.category,
                description: this.ideaStore.idea.description,
                content: this.content,
                note: this.ideaStore.idea.note,
                status: this.ideaStore.idea.status,
                sticky: this.ideaStore.idea.sticky,
                todos: Array.from(this.ideaStore.idea.todos)
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
