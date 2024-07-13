<template>
    <div>
        <div class="modal-backdrop fade show"></div>
        <div id="ideaModal" class="modal fade show" tabindex="-1" aria-labelledby="ideaModalLabel">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="ideaModalLabel" class="modal-title h5">Idée</h3>
                        <button type="button" class="btn-close" aria-label="fermeture" @click.prevent="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label for="title" class="form-label required">Titre</label>
                                    <input
                                        id="title"
                                        v-model="title"
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': v$.title.$errors.length }"
                                    />
                                    <div class="invalid-feedback">
                                        Ce champ est obligatoire et doit faire entre 2 et 255 caractères.
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="date" class="form-label required">Date</label>
                                    <VueDatePicker
                                        id="date"
                                        v-model="date"
                                        locale="fr"
                                        :format="format"
                                        :enable-time-picker="false"
                                        auto-apply
                                        required
                                    />
                                </div>
                                <div v-if="v$.date.$errors.length" class="text-danger small">Ce champ est obligatoire.</div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <div class="mb-3">
                                        <label for="status" class="form-label required">Statut</label>
                                        <VueMultiselect
                                            v-model="status"
                                            :options="statusOptions"
                                            :allow-empty="false"
                                            :multiple="false"
                                            :close-on-select="true"
                                            placeholder="Choisir un statut"
                                            select-label="Appuyer sur entrée pour choisir"
                                            selected-label="Sélectionné"
                                            deselect-label="Appuyer sur entrée pour enlever"
                                            label="label"
                                            track-by="value"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="categories" class="form-label">Catégorie</label>
                                    <VueMultiselect
                                        v-model="category"
                                        :options="options"
                                        :allow-empty="true"
                                        :multiple="false"
                                        :close-on-select="true"
                                        placeholder="Choisir une catégorie"
                                        select-label="Appuyer sur entrée pour choisir"
                                        selected-label="Sélectionné"
                                        deselect-label="Appuyer sur entrée pour enlever"
                                        label="name"
                                        track-by="_id"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="keywords" class="form-label">Mots clés</label>
                            <input id="keywords" v-model="keywords" type="text" class="form-control" />
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea
                                id="description"
                                v-model="description"
                                class="form-control"
                                rows="3"
                                :class="{ 'is-invalid': v$.description.$errors.length }"
                            ></textarea>
                            <div class="invalid-feedback">Ce champ doit faire entre 3 et 1500 caractères.</div>
                        </div>

                        <div class="mb-3 border rounded p-2">
                            <label for="note" class="form-label">
                                Note : <strong>{{ note }}/5</strong>
                            </label>
                            <input id="note" v-model="note" type="range" class="form-range" min="0" max="5" step="1" />
                        </div>
                        <div class="form-check form-switch">
                            <input id="sticky" v-model="sticky" class="form-check-input" type="checkbox" role="switch" />
                            <label class="form-check-label" for="sticky"> Epingler sur le tableau de bord ?</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success btn-sm" @click.prevent="save">Sauvegarder</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import VueMultiselect from 'vue-multiselect';
import '@vuepic/vue-datepicker/dist/main.css';
import { mapStores } from 'pinia';
import { useCategoryStore } from '../stores/category';
import { useIdeaStore } from '../stores/idea';
import { useVuelidate } from '@vuelidate/core';
import { required, maxLength, minLength, minValue, maxValue } from '@vuelidate/validators';
import { createToastify } from '../utils/toastify';
import dayjs from 'dayjs';

export default {
    name: 'IdeaModal',

    components: {
        VueDatePicker,
        VueMultiselect
    },

    props: {
        idea: {
            type: Object,
            default: null,
            categoryOptions: []
        }
    },

    emits: ['on-close'],

    data() {
        return {
            sticky: false,
            date: new Date(),
            title: null,
            keywords: null,
            description: null,
            category: null,
            note: '0',
            status: { value: '0', label: 'en brouillon' },
            v$: useVuelidate()
        };
    },

    computed: {
        ...mapStores(useCategoryStore, useIdeaStore),

        options() {
            return Object.values(this.categoryStore.categories);
        },

        statusOptions() {
            return [
                { value: '0', label: 'en brouillon' },
                { value: '1', label: 'à faire' },
                { value: '2', label: 'validé' },
                { value: '3', label: 'annulé' },
                { value: '4', label: 'en cours' }
            ];
        }
    },

    validations() {
        return {
            title: { required, maxLength: maxLength(255), minLength: minLength(2) },
            description: { maxLength: maxLength(1500), minLength: minLength(3) },
            note: { required, minValue: minValue(0), maxValue: maxValue(5) },
            status: { required },
            date: { required }
        };
    },

    mounted() {
        if (this.idea !== null) {
            this.sticky = this.idea.sticky;
            this.date = this.idea.date;
            this.title = this.idea.title;
            this.keywords = this.idea.keywords;
            this.description = this.idea.description;
            this.category = this.categoryStore.categories[this.idea.category];
            this.note = this.idea.note;
            this.status = this.statusOptions[parseInt(this.idea.status)];
        } else {
            this.status = this.statusOptions[0];
        }
    },

    methods: {
        closeModal() {
            this.$emit('on-close');
        },

        format(date) {
            return dayjs(date).format('DD/MM/YYYY');
        },

        async save() {
            this.loading = true;
            const result = await this.v$.$validate();

            if (!result) {
                createToastify('Le formulaire comporte des erreurs.', 'error');
                this.loading = false;
                return;
            }

            const data = {
                date: dayjs(this.date).format('YYYY-MM-DD HH:mm:ss'),
                title: this.title,
                keywords: this.keywords,
                category: this.category ? this.category._id : null,
                description: this.description,
                content: this.idea !== null ? this.idea.content : null,
                note: this.note,
                status: this.status ? this.status.value : '0',
                sticky: this.sticky
            };

            if (this.idea !== null) {
                await this.edit(data);
            } else {
                await this.create(data);
            }
        },

        async create(data) {
            const status = await this.ideaStore.append(data);
            if (!status) {
                createToastify('Le formulaire comporte des erreurs.', 'error');
            } else {
                this.closeModal();
            }
        },

        async edit(data) {
            const status = await this.ideaStore.update(data, this.idea._id);
            if (!status) {
                createToastify('Le formulaire comporte des erreurs.', 'error');
            } else {
                this.closeModal();
            }
        }
    }
};
</script>

<style>
#ideaModal {
    display: block;
    z-index: 3000;
}

#ideaModal .choices {
    margin-bottom: 0;
}

.modal-backdrop {
    z-index: 2080;
}
</style>
