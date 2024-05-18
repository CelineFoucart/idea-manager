<script setup lang="js">
import Navbar from './components/Navbar.vue';
</script>

<template>
    <div id="sidebar">
        <Navbar></Navbar>
    </div>

    <main id="main" class="pb-2">
        <div class="container-fluid">
            <router-view></router-view>
        </div>
    </main>
</template>
