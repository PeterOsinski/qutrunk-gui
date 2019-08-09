<template>
    <div>
        <div class="navbar navbar-expand-md navbar-dark bg-indigo navbar-static fixed-top">
            <div class="d-md-none">
                <button @click="toggleSidebar" class="navbar-toggler sidebar-mobile-main-toggle" type="button">
                    <i class="icon-paragraph-justify3"></i>
                </button>
            </div>
            <div class="collapse navbar-collapse" id="navbar-mobile">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a href="#" class="navbar-nav-link sidebar-control sidebar-main-toggle d-none d-md-block">
                        <i class="icon-paragraph-justify3"></i>
                    </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Page content -->
        <div class="page-content">
            <!-- Main sidebar -->
            <div class="sidebar sidebar-light sidebar-main sidebar-expand-md">
                <!-- Sidebar mobile toggler -->
                <div class="sidebar-mobile-toggler text-center">
                    <a @click="toggleSidebar" style="cursor: pointer" class="sidebar-mobile-main-toggle">
                    <i class="icon-arrow-left8"></i>
                </a>
                </div>
                <!-- /sidebar mobile toggler -->
                <!-- Sidebar content -->
                <div class="sidebar-content">
                    <!-- Main navigation -->
                    <div class="card card-sidebar-mobile">
                        <center>
                            <router-link :to="{name:'dashboard'}">
                                <img class="logo-qutrunk" src="/static/images/qutrunk_logo.png"/>
                            </router-link>
                        </center>
                        <ul class="nav nav-sidebar" data-nav-type="accordion">
                            <li class="nav-item">
                                <router-link :to="{name:'dashboard'}" class="nav-link" :class="{'active':$route.name === 'dashboard'}">
                                    <i class="icon-home4"></i>
                                    <span>Dashboard</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :to="{name:'queues'}" class="nav-link" :class="{'active':$route.name === 'queues'}">
                                    <i class="icon-tree5"></i>
                                    <span>Queues</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :to="{name:'logs'}" class="nav-link" :class="{'active':$route.name === 'logs'}">
                                    <i class="icon-envelop2"></i>
                                    <span>Message log</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :to="{name:'access_tokens'}" class="nav-link" :class="{'active':$route.name === 'access_tokens'}">
                                    <i class="icon-key"></i>
                                    <span>Access tokens</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :to="{name:'backends'}" class="nav-link" :class="{'active':$route.name === 'backends'}">
                                    <i class="icon-database2"></i>
                                    <span>Backends</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :to="{name:'settings'}" class="nav-link" :class="{'active':$route.name === 'settings'}">
                                    <i class="icon-cog3"></i>
                                    <span>Settings</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :to="{name:'doc'}" class="nav-link" :class="{'active':$route.name === 'doc'}">
                                    <i class="icon-book3"></i>
                                    <span>Documentation</span>
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link :to="'/logout'" class="nav-link">
                                    <i class="icon-exit2"></i>
                                    <span>Logout</span>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <!-- /main navigation -->
                </div>
                <!-- /sidebar content -->
            </div>
            <!-- /main sidebar -->
            <!-- Main content -->
            <div class="content-wrapper">
                <router-view></router-view>
            </div>
            <!-- /main content -->
        </div>
    </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            checking: false,
            authenticated: false,
            responseTime: 0,
            serverUptime: null,
            refreshRequired: false,
            show: false,
            connectionError: false,
            loggedIn: false,
            sidebarVisible: false
        }
    },
    mounted() {},
    methods: {
        toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible
            if (this.sidebarVisible) {
                this.toggleBodyClass('addClass', 'sidebar-mobile-main')
            } else {
                this.toggleBodyClass(null, 'sidebar-mobile-main')
            }
        },
        toggleBodyClass(addRemoveClass, className) {
            const el = document.body;
            console.log(addRemoveClass, className)
            if (addRemoveClass === 'addClass') {
                el.classList.add(className);
            } else {
                el.classList.remove(className);
            }
        }
    }
}
</script>