<template>
    <article>
        <header class="mb-4">
            <h2 class="display-3 fw-normal mb-1">Tableau de bord</h2>
        </header>
    </article>
</template>

<script>
import { datetimeMixin } from '../utils/datetimeMixin';

export default {
    name: 'Dashboard',
    mixins: [datetimeMixin]
};
</script>
