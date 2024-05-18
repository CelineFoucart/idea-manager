<template>
    <article>
        <h2>Tableau de bord</h2>
    </article>
</template>

<script>
import { datetimeMixin } from '../utils/datetimeMixin';

export default {
    name: 'Dashboard',
    mixins: [datetimeMixin],

    mounted() {
        console.log(this.formatDateTime());
    }
};
</script>
