<script setup lang="js">
import Navbar from './components/Navbar.vue';
</script>

<template>
    <Navbar></Navbar>
    <main id="main" class="py-2">
        <div class="container-fluid">
            <router-view></router-view>
        </div>
    </main>
</template>
