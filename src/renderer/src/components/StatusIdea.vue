<template>
    <span v-if="statusName !== null" class="badge ms-1" :class="statusColor">
        <i v-if="status == 0" class="bi bi-pencil-square"></i>
        <i v-if="status == 1" class="bi bi-check2-square"></i>
        <i v-if="status == 2" class="bi bi-check-lg"></i>
        <i v-if="status == 3" class="bi bi-x-lg"></i>
        {{ statusName }}
    </span>
</template>

<script>
export default {
    name: 'StatusIdea',

    props: {
        status: {
            type: String,
            default: null
        }
    },

    data() {
        return {
            statusNames: ['en brouillon', 'à faire', 'validé', 'annulé']
        };
    },

    computed: {
        statusColor() {
            if (parseInt(this.status) == 0) {
                return 'text-bg-secondary';
            } else if (parseInt(this.status) == 1) {
                return 'text-bg-primary';
            } else if (parseInt(this.status) == 2) {
                return 'text-bg-success';
            } else {
                return 'text-bg-danger';
            }
        },

        statusName() {
            if (parseInt(this.status) >= 0 || parseInt(this.status) < 4) {
                return this.statusNames[parseInt(this.status)];
            }

            return null;
        }
    }
};
</script>
