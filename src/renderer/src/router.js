import Dashboard from './views/Dashboard.vue';
import Index from './views/Index.vue';
import Show from './views/Show.vue';
import { createRouter, createWebHistory } from 'vue-router';
import TodoList from './views/TodoList.vue';

export default new createRouter({
    history: createWebHistory(0),
    routes: [
        {
            path: `/`,
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: `/ideas`,
            name: 'idea_index',
            component: Index
        },
        {
            path: `/ideas/:id`,
            name: 'idea_show',
            component: Show
        },
        {
            path: `/task`,
            name: 'task_index',
            component: TodoList
        }
    ]
});
