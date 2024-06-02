<script setup lang="js">
import { useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';
useRouter().push('/');
</script>

<template>
    <Navbar></Navbar>
    <main id="main" class="py-2">
        <div class="container-fluid">
            <router-view></router-view>
        </div>
    </main>
</template>
