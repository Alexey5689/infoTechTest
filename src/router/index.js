import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../pages/LoginPage.vue'),
    },
    {
        path: '/catalog',
        name: 'Catalog',
        component: () => import('../pages/CatalogPage.vue'),
    },
    {
        path: '/books/:id',
        name: 'BookDetail',
        component: () => import('../pages/BookDetailPage.vue'),
    },
    {
        path: '/authors',
        name: 'Authors',
        component: () => import('../pages/AuthorsPage.vue'),
    },
    {
        path: '/authors/:id',
        name: 'AuthorDetail',
        component: () => import('../pages/AuthorDetailPage.vue'),
    },
    {
        path: '/reports',
        name: 'Reports',
        component: () => import('../pages/ReportsPage.vue'),
    },
    {
        path: '/books-manage',
        name: 'BooksManage',
        component: () => import('../pages/BooksManagePage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/',
        redirect: '/catalog',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && authStore.isAuthenticated) {
        next('/catalog');
    } else {
        next();
    }
});

export default router;
