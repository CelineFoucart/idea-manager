<template>
    <nav class="navbar sticky-top navbar-expand navbar-dark bg-dark">
        <div class="container-fluid">
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav">
                    <li class="nav-item pe-2">
                        <router-link
                            v-tooltip="'Tableau de bord'"
                            :to="{ name: 'dashboard' }"
                            class="nav-link"
                            active-class="active"
                        >
                            <i class="bi bi-house-door-fill"></i>
                            <div class="visually-hidden">Tableau de bord</div>
                        </router-link>
                    </li>
                    <li class="nav-item pe-2">
                        <router-link
                            v-tooltip="'Liste des idées'"
                            :to="{ name: 'idea_index' }"
                            class="nav-link"
                            active-class="active"
                        >
                            <i class="bi bi-table"></i>
                            <div class="visually-hidden">Liste des idées</div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar'
};
</script>
