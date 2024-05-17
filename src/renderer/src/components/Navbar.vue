<template>
    <aside class="bg-dark text-bg-dark border-dark h-100 py-3 px-2">
        <h1 class="fs-5 text-center">{{ title }}</h1>
        <hr />
        <ul class="nav nav-pills flex-column mb-auto">
            <li>
                <router-link :to="{ name: 'dashboard' }" class="nav-link" active-class="active">
                    <i class="bi bi-house-door-fill"></i>
                    Tableau de bord
                </router-link>
            </li>
            <li>
                <router-link :to="{ name: 'idea_index' }" class="nav-link" active-class="active">
                    <i class="bi bi-table"></i>
                    Liste des idées
                </router-link>
            </li>
        </ul>
    </aside>
</template>

<script>
export default {
    name: 'Navbar',

    data() {
        return {
            title: null
        };
    },

    mounted() {
        this.title = document.title;
    }
};
</script>

<style scoped>
.nav-pills .nav-link {
    color: #f8f9fa;
    border-left: 2px solid transparent;
    transition: all ease-in-out 0.3s;
    border-radius: 0;
}

.nav-pills .nav-link.active {
    background-color: #292b2d;
    border-left: 2px solid #f8f9fa;
}
</style>
