<template>
    <nav class="navbar sticky-top navbar-expand navbar-dark bg-dark">
        <div class="container-fluid">
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto">
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
                            <i class="bi bi-file-text-fill"></i>
                            <div class="visually-hidden">Liste des idées</div>
                        </router-link>
                    </li>
                    <li class="nav-item pe-2">
                        <router-link v-tooltip="'Tâches'" :to="{ name: 'task_index' }" class="nav-link" active-class="active">
                            <i class="bi bi-list-task"></i>
                            <div class="visually-hidden">Tâches</div>
                        </router-link>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <button v-tooltip="'A propos'" class="nav-link" data-bs-toggle="modal" data-bs-target="#about">
                            <i class="bi bi-info-circle-fill"></i>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div id="about" class="modal fade" tabindex="-1" aria-labelledby="aboutLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="aboutLabel" class="modal-title fs-5">A propos de {{ appTitle }}</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex align-items-center justify-content-center gap-2">
                        <img src="/src/assets/icon.png" alt="icon de l'application" width="70" />
                        <h3 class="display-4 text-danger">{{ appTitle }}</h3>
                    </div>
                    <hr />
                    <p>
                        {{ appTitle }} est une application de gestion d'idées avec un système de prise de notes et une partie de
                        tâches à faire. L'application permet de catégoriser les idées et de mettre des priorités sur les tâches.
                        Sur votre tableau de bord, vous pouvez épingler les idées sur lesquelles vous travaillez actuellement.
                    </p>

                    <ul class="list-unstyled small">
                        <li>Version&nbsp;: {{ appVersion }}</li>
                        <li>Electron&nbsp;: {{ versions.electron }}</li>
                        <li>Chromium&nbsp;: {{ versions.chrome }}</li>
                        <li>Node.js&nbsp;: {{ versions.node }}</li>
                    </ul>

                    <div id="license" class="accordion mt-4">
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button
                                    class="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne"
                                    aria-expanded="false"
                                    aria-controls="collapseOne"
                                >
                                    Ce licence est fourni sous licence <strong class="ps-1">MIT</strong>.
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <p>Copyright 2024 <a href="https://github.com/CelineFoucart">Céline Foucart</a></p>
                                    <p>
                                        Permission is hereby granted, free of charge, to any person obtaining a copy of this
                                        software and associated documentation files (the “Software”), to deal in the Software
                                        without restriction, including without limitation the rights to use, copy, modify, merge,
                                        publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
                                        to whom the Software is furnished to do so, subject to the following conditions:
                                    </p>
                                    <p>
                                        The above copyright notice and this permission notice shall be included in all copies or
                                        substantial portions of the Software.
                                    </p>
                                    <p>
                                        THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                                        INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                                        PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
                                        FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                                        OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
                                        DEALINGS IN THE SOFTWARE.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { version } from '../../../../package.json';

export default {
    name: 'Navbar',

    data() {
        return {
            appTitle: null
        };
    },

    computed: {
        versions() {
            return window.electron.process.versions;
        },

        appVersion() {
            return version;
        }
    },

    mounted() {
        this.appTitle = document.title;
    }
};
</script>

<style scoped>
.modal {
    --bs-modal-zindex: 9100;
}
</style>
