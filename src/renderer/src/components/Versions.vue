<script setup>
import { reactive } from 'vue';
// const ipcHandle = () => window.electron.ipcRenderer.send('ping');
const versions = reactive({ ...window.electron.process.versions });
</script>

<template>
    <ul class="versions">
        <li class="electron-version">Electron v{{ versions.electron }}</li>
        <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
        <li class="node-version">Node v{{ versions.node }}</li>
    </ul>
</template>
