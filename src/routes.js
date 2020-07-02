/*
 * Copyright (C) 2020, Matthew Livingstone
 * All rights reserved.
 */

import Login from './components/Login.vue';
import ManageInteger from './components/ManageInteger.vue';

const routes = [
    { path: '/', component: ManageInteger, name: 'my-integer' },
    { path: '/login', component: Login, name: 'login' },
    { path: '*', redirect: '/' }
];

export default routes;