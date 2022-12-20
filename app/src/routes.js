export default [
    {
        name: 'Landing',
        path: '/',
        component: require('@/components/PageLanding').default,
    },
    {
        name: 'Skins',
        path: '/skins',
        component: require('@/components/PageSkins').default,
    },
    {
        name: 'Play',
        path: '/play',
        component: require('@/components/PagePlay').default,
    },
    {
        name: 'PageNotFound',
        path: '/:pathMatch(.*)*',
        component: require('@/components/PageNotFound').default,
    },
]
