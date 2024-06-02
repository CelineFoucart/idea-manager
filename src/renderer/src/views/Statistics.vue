<template>
    <article>
        <header class="mb-4">
            <h1 class="display-3 fw-normal mb-1">Statistiques des idées</h1>
        </header>

        <div class="row g-2">
            <div class="col-lg-6">
                <section class="card shadow-sm">
                    <div class="card-header">
                        <h2 class="fs-5 card-title">Idées par année</h2>
                    </div>
                    <div class="card-body">
                        <Bar :data="barYearData" :options="options" :style="stylesGraph"></Bar>
                    </div>
                </section>
            </div>
            <div class="col-lg-6">
                <section class="card shadow-sm">
                    <div class="card-header">
                        <h2 class="fs-5 card-title">Idées par catégorie</h2>
                    </div>
                    <div class="card-body">
                        <Bar :data="barCategoryData" :options="options" :style="stylesGraph"></Bar>
                    </div>
                </section>
            </div>
            <div class="col-lg-12">
                <section class="card shadow-sm">
                    <div class="card-header">
                        <h2 class="fs-5 card-title">Idées par statut</h2>
                    </div>
                    <div class="card-body">
                        <Pie :data="byStatus" :options="optionsPie" :style="stylesGraph"></Pie>
                    </div>
                </section>
            </div>
        </div>
    </article>
</template>

<script lang="js">
import { mapStores } from 'pinia';
import { useIdeaStore } from '@renderer/stores/idea';
import { useCategoryStore } from '@renderer/stores/category';
import { createToastify } from '@renderer/utils/toastify';
import dayjs from 'dayjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from 'vue-chartjs';
ChartJS.register(Tooltip, ArcElement, Legend, CategoryScale, LinearScale, BarElement, Title);

export default {
    name: 'Statistics',

    components: {
        Bar,
        Pie
    },

    data() {
        return {
            yearLabels: [],
            yearData: [],
            categoryData: {},
            statusData: { 0: 0, 1: 0, 2: 0, 3: 0 },
            options: {
                responsive: false,
                maintainAspectRatio: true,
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
            optionsPie: {
                responsive: false,
                maintainAspectRatio: true
            },
            stylesGraph: {
                width: '100%'
            }
        };
    },

    computed: {
        ...mapStores(useIdeaStore, useCategoryStore),

        barYearData() {
            return {
                labels: this.yearLabels,
                datasets: [
                    {
                        label: 'Idées',
                        backgroundColor: '#f87979',
                        data: this.yearData
                    }
                ]
            };
        },

        barCategoryData() {
            const labels = [];
            const values = [];

            for (const key in this.categoryData) {
                const row = this.categoryData[key];
                labels.push(row.label);
                values.push(row.value);
            }

            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Par catégorie',
                        backgroundColor: '#6610f2',
                        data: values
                    }
                ]
            };
        },

        byStatus() {
            return {
                labels: ['en brouillon', 'à faire', 'validé', 'annulé'],
                datasets: [
                    {
                        backgroundColor: ['#6c757d', '#fd7e14', '#198754', '#dc3545'],
                        data: Object.values(this.statusData)
                    }
                ]
            };
        }
    },

    async mounted() {
        const status = await this.ideaStore.getIdeas();
        if (!status) {
            createToastify('La récupération des données a échoué', 'error');
        }

        const statusCategories = await this.categoryStore.getCategories();
        if (!statusCategories) {
            createToastify('La récupération des catégories a échoué', 'error');
        }

        this.setData();
    },

    methods: {
        setData() {
            this.yearLabels = [];
            const yearData = {};
            const statusData = { 0: 0, 1: 0, 2: 0, 3: 0 };
            const dataCategory = {};

            this.ideaStore.ideas.forEach((idea) => {
                // by years
                const label = dayjs(idea.date).format('YYYY');
                if (!this.yearLabels.includes(label)) {
                    this.yearLabels.push(label);
                    yearData[label] = 1;
                } else {
                    yearData[label] += 1;
                }
                // by status
                statusData[parseInt(idea.status)] += 1;
                // by category
                let category = this.categoryStore.categories[idea.category] ? this.categoryStore.categories[idea.category] : null;
                if (category === null) {
                    category = { _id: '0', name: 'Sans catégorie' };
                }
                if (!(category._id in dataCategory)) {
                    dataCategory[category._id] = { value: 0, label: category.name };
                }
                dataCategory[category._id].value += 1;
            });

            const sortedYears = Object.keys(yearData)
                .sort()
                .reduce((finalObject, key) => {
                    finalObject[key] = yearData[key];
                    return finalObject;
                }, {});

            this.yearLabels = Object.keys(sortedYears);
            this.yearData = Object.values(sortedYears);
            this.statusData = statusData;
            this.categoryData = dataCategory;
        }
    }
};
</script>
