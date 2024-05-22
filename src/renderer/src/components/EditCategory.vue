<template>
    <div class="modal-backdrop fade show"></div>
    <div id="addModal" class="modal fade show" tabindex="-1" aria-labelledby="addModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header py-2">
                    <h5 id="addModalLabel" class="modal-title">Catégorie</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>
                <div class="modal-body">
                    <form action="">
                        <div class="mb-3">
                            <label for="name" class="required">Nom</label>
                            <input id="name" v-model="name" type="text" class="form-control" />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" @click="close">Annuler</button>
                    <button type="button" class="btn btn-success btn-sm" data-bs-dismiss="modal" @click.prevent="save">
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useCategoryStore } from '@renderer/stores/category.js';
import { mapStores } from 'pinia';
import { createToastify } from '@renderer/utils/toastify.js';

export default {
    name: 'EditCategory',

    props: {
        data: Object
    },

    emits: ['on-close'],

    data() {
        return {
            name: null
        };
    },

    computed: {
        ...mapStores(useCategoryStore)
    },

    mounted() {
        this.name = this.data.name;
    },

    methods: {
        close() {
            this.$emit('on-close');
        },

        async save() {
            if (this.name === null || this.name.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');
            }

            const status = this.categoryStore.update({ name: this.name }, this.data._id);
            if (status === false) {
                createToastify("L'opération a échoué", 'error');
            } else {
                createToastify("L'élément a été modifié", 'success');
                this.close();
            }
        }
    }
};
</script>

<style>
#addModal {
    display: block;
    z-index: 3000;
}
</style>
