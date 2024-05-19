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
                        <div class="mb-3">
                            <label for="title" class="form-label required">Titre</label>
                            <input
                                id="title"
                                v-model="title"
                                type="text"
                                class="form-control"
                                :class="{ 'is-invalid': v$.title.$errors.length }"
                            />
                            <div class="invalid-feedback">Ce champ est obligatoire et doit faire entre 2 et 255 caractères.</div>
                        </div>

                        <div class="mb-3">
                            <label for="categories" class="form-label">Catégorie</label>
                            <select id="categories" v-model="category" class="form-select">
                                <option v-for="item in categoryStore.categories" :key="item._id" :value="item._id">
                                    {{ item.name }}
                                </option>
                            </select>
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

                        <div class="mb-3">
                            <label for="note" class="form-label">
                                Note : <strong>{{ note }}/5</strong>
                            </label>
                            <input id="note" v-model="note" type="range" class="form-range" min="0" max="5" step="1" />
                        </div>

                        <div class="mb-3">
                            <div class="mb-3">
                                <label for="categories" class="form-label">Statut</label>
                                <select id="categories" v-model="status" class="form-select">
                                    <option value="0">En brouillon</option>
                                    <option value="1">A faire</option>
                                    <option value="2">Validé</option>
                                    <option value="3">Annulé</option>
                                </select>
                            </div>
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
import { mapStores } from 'pinia';
import { useCategoryStore } from '../stores/category';
import { useIdeaStore } from '../stores/idea';
import { useVuelidate } from '@vuelidate/core';
import { required, maxLength, minLength, minValue, maxValue } from '@vuelidate/validators';
import { createToastify } from '../utils/toastify';
import dayjs from 'dayjs';

export default {
    name: 'IdeaModal',

    props: {
        idea: {
            type: Object,
            default: null
        }
    },

    emits: ['on-close'],

    data() {
        return {
            title: null,
            keywords: null,
            description: null,
            category: null,
            note: '0',
            status: '0',
            v$: useVuelidate()
        };
    },

    computed: {
        ...mapStores(useCategoryStore, useIdeaStore)
    },

    validations() {
        return {
            title: { required, maxLength: maxLength(255), minLength: minLength(2) },
            description: { maxLength: maxLength(1500), minLength: minLength(3) },
            note: { required, minValue: minValue(0), maxValue: maxValue(5) },
            status: { required, minValue: minValue(0), maxValue: maxValue(3) }
        };
    },

    mounted() {
        if (this.idea !== null) {
            this.title = this.idea.title;
            this.keywords = this.idea.keywords;
            this.description = this.idea.description;
            this.category = this.idea.category;
            this.note = this.idea.note;
            this.status = this.idea.status;
        }
    },

    methods: {
        closeModal() {
            this.$emit('on-close');
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
                date: this.idea !== null ? this.idea.date : dayjs().format('YYYY-MM-DD HH:mm:ss'),
                title: this.title,
                keywords: this.keywords,
                category: this.category,
                description: this.description,
                content: this.idea !== null ? this.idea.content : null,
                note: this.note,
                status: this.status,
                sticky: this.idea !== null ? this.idea.sticky : false,
                todos: this.idea !== null ? Array.from(this.idea.todos) : []
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
