<template>
    <div>
        <div class="modal-backdrop fade show"></div>
        <div id="modalDelete" class="modal fade show" tabindex="-1" aria-labelledby="modalDeleteLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalDeleteConfigLabel" class="modal-title h5 text-danger">Suppression</h3>
                        <button type="button" class="btn-close" aria-label="fermeture" @click.prevent="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-danger fs-5 mb-0">
                            Attention, toute suppression est définitive ! Voulez-vous vraiment supprimer
                            <span class="fw-bold">{{ title }}</span> ?
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-sm" @click.prevent="closeModal">Annuler</button>
                        <button type="button" class="btn btn-danger btn-sm" @click.prevent="accept">Confirmer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeleteModal',

    props: {
        title: String,
        loading: {
            type: Boolean,
            default: false
        }
    },

    emits: ['on-close', 'on-confirm'],

    methods: {
        closeModal() {
            this.$emit('on-close');
        },

        accept() {
            this.$emit('on-confirm');
        }
    }
};
</script>

<style scoped>
#modalDelete {
    display: block;
    z-index: 3000;
}

.modal-backdrop {
    z-index: 2080;
}
</style>
