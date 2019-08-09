<template>
    <div class="page-content login-cover">
        <!-- Main content -->
        <div class="content-wrapper">
            <!-- Content area -->
            <div class="content d-flex justify-content-center align-items-center">
                <!-- Login form -->
                <form class="login-form wmin-sm-400">
                    <div class="card mb-0">
                        <ul class="nav nav-tabs nav-justified alpha-grey mb-0">
                            <li class="nav-item"><a href="#" @click="tab = 'login'" class="nav-link border-y-0 border-left-0 legitRipple  " :class="{active: tab === 'login'}"><h6 class="my-1">Sign in</h6></a></li>
                            <li class="nav-item"><a href="#" :class="{active: tab === 'register'}"  @click="tab = 'register'" class="nav-link border-y-0 border-right-0 legitRipple"><h6 class="my-1">Register</h6></a></li>
                        </ul>
                        <div class="tab-content card-body">
                            <div class="tab-pane fade" :class="{active: tab === 'login', show: tab === 'login'}" id="login-tab1">
                                <div class="text-center mb-3">
                                    <a href="https://qutrunk.com"><img src="/static/images/qutrunk_logo.png"/></a>
                                    <h4>Login</h4>
                                </div>
                                <!--    <div class="text-center mb-3">
                                    <i class="icon-reading icon-2x text-slate-300 border-slate-300 border-3 rounded-round p-3 mb-3 mt-1"></i>
                                    <h5 class="mb-0">Login to your account</h5>
                                    <span class="d-block text-muted">Your credentials</span>
                                </div> -->
                                <template v-if="!running.social">
                                    <div class="form-group form-group-feedback form-group-feedback-left">
                                        <input v-model="login.email" type="text" class="form-control" placeholder="Email">
                                        <div class="form-control-feedback">
                                            <i class="icon-user text-muted"></i>
                                        </div>
                                    </div>
                                    <div class="form-group form-group-feedback form-group-feedback-left">
                                        <input v-model="login.password" type="password" class="form-control" placeholder="Password">
                                        <div class="form-control-feedback">
                                            <i class="icon-lock2 text-muted"></i>
                                        </div>
                                    </div>
                                    <div class="form-group d-flex align-items-center">
                                        <!-- <div class="form-check mb-0">
                                        <label class="form-check-label">
                                            <div class="uniform-checker"><span class="checked"><input type="checkbox" name="remember" class="form-input-styled" checked="" data-fouc=""></span></div>
                                            Remember
                                        </label>
                                    </div> -->
                                    </div>
                                    <div class="form-group">
                                        <button :class="{'loading-mask': running.login}" @click="loginEmail($event)" class="btn btn-primary btn-block legitRipple">Sign in</button>
                                    </div>
                                <div class="form-group text-center text-muted content-divider">
                                    <span class="px-2"><span @click="tab = 'register'" style="text-decoration: underline; cursor: pointer">register here</span></span>
                                </div>
                                    <div class="form-group">
                                        <button :class="{'loading-mask': running.password}" @click="resetPassword($event)" class="btn btn-slate btn-block legitRipple">Forgot password</button>
                                    </div>
                                    <div class="alert bg-success" v-if="success">{{success}}</div>
                                    <div class="alert bg-danger" v-if="error">{{error}}</div>
                                    <div class="form-group text-center text-muted content-divider">
                                        <span class="px-2">or sign in with</span>
                                    </div>
                                    <div class="form-group text-center">
                                        <button type="button" @click="loginSocial($event, 'github')" class="btn btn-outline bg-slate-600 border-slate-600 text-slate-600 btn-icon rounded-round border-2 ml-2 legitRipple"><i class="fa fa-github" v-tooltip="'Login with Github'" style="font-size:22px"></i></button>
                                        <button type="button" @click="loginSocial($event, 'bitbucket')" class="btn btn-outline bg-slate-600 border-slate-600 text-slate-600 btn-icon rounded-round border-2 ml-2 legitRipple"><i class="fa fa-bitbucket" v-tooltip="'Login with Bitbucket'" style="font-size:22px"></i></button>
                                    </div>
                                </template>
                                <div class="alert bg-primary" v-if="running.social" style="margin-top:10px">Redirecting... </div>
                                <!-- <div class="form-group text-center text-muted content-divider">
                                    <span class="px-2">Don't have an account?</span>
                                </div>

                                <div class="form-group">
                                    <a href="#" class="btn btn-light btn-block legitRipple">Sign up</a>
                                </div> -->
                                <span class="form-text text-center text-muted">By continuing, you're confirming that you've read our <a href="#">Terms &amp; Conditions</a> and <a href="#">Cookie Policy</a> and accept it.</span>
                            </div>
                            <div class="tab-pane fade" :class="{active: tab === 'register', show : tab === 'register'}" id="login-tab2">
                                <div class="text-center mb-3">
                                    <a href="https://qutrunk.com"><img src="/static/images/qutrunk_logo.png"/></a>
                                    <h4>Register</h4>
                                </div>
                                <!--    <div class="text-center mb-3">
                                    <i class="icon-plus3 icon-2x text-success border-success border-3 rounded-round p-3 mb-3 mt-1"></i>
                                    <h5 class="mb-0">Create account</h5>
                                    <span class="d-block text-muted">All fields are required</span>
                                </div> -->
                                <div class="form-group form-group-feedback form-group-feedback-left">
                                    <input v-model="register.email" type="email" class="form-control" placeholder="Your email">
                                    <div class="form-control-feedback">
                                        <i class="icon-mention text-muted"></i>
                                    </div>
                                </div>
                                <div class="form-group form-group-feedback form-group-feedback-left">
                                    <input v-model="register.password" type="password" class="form-control" placeholder="Your password">
                                    <div class="form-control-feedback">
                                        <i class="icon-user-lock text-muted"></i>
                                    </div>
                                </div>
                                <div class="form-group form-group-feedback form-group-feedback-left">
                                    <input v-model="register.repeatPassword" type="password" class="form-control" placeholder="Retype password">
                                    <div class="form-control-feedback">
                                        <i class="icon-user-lock text-muted"></i>
                                    </div>
                                </div>
                                <!-- 
                                <div class="form-group text-center text-muted content-divider">
                                    <span class="px-2">Additions</span>
                                </div>
                                <div class="form-group">
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <div class="uniform-checker"><span class="checked"><input type="checkbox" name="remember" class="form-input-styled" checked="" data-fouc=""></span></div>
                                            Send me <a href="#">test account settings</a>
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <div class="uniform-checker"><span class="checked"><input type="checkbox" name="remember" class="form-input-styled" checked="" data-fouc=""></span></div>
                                            Subscribe to monthly newsletter
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <div class="uniform-checker"><span><input type="checkbox" name="remember" class="form-input-styled" data-fouc=""></span></div>
                                            Accept <a href="#">terms of service</a>
                                        </label>
                                    </div>
                                </div> -->
                                <div class="form-group">
                                    <button :class="{'loading-mask': running.register}" @click="registerEmail($event)" class="btn bg-dark btn-block legitRipple">Register</button>
                                </div>
                                <div class="alert bg-success" v-if="success">{{success}}</div>
                                <div class="alert bg-danger" v-if="error">{{error}}</div>
                                <div class="form-group text-center text-muted content-divider">
                                    <span class="px-2">or sign in with</span>
                                </div>
                                <div class="form-group text-center">
                                    <button type="button" @click="loginSocial($event, 'github')" class="btn btn-outline bg-slate-600 border-slate-600 text-slate-600 btn-icon rounded-round border-2 ml-2 legitRipple"><i class="fa fa-github" v-tooltip="'Login with Github'" style="font-size:22px"></i></button>
                                    <button type="button" @click="loginSocial($event, 'bitbucket')" class="btn btn-outline bg-slate-600 border-slate-600 text-slate-600 btn-icon rounded-round border-2 ml-2 legitRipple"><i class="fa fa-bitbucket" v-tooltip="'Login with Bitbucket'" style="font-size:22px"></i></button>
                                </div>
                                <span class="form-text text-center text-muted">By signing up, you're confirming that you've read our <a href="https://qutrunk.com/terms">Terms &amp; Conditions</a> and <a href="https://qutrunk.com/privacy-policy">Privacy Policy</a> and accept it.</span>
                            </div>
                        </div>
                    </div>
                </form>
                <!-- /login form -->
            </div>
            <!-- /content area -->
        </div>
        <!-- /main content -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            tab: 'login',
            login: {
                email: '',
                password: ''
            },
            register: {
                email: '',
                password: '',
                repeatPassword: ''
            },
            success: '',
            error: '',
            running: {
                password: false,
                login: false,
                register: false,
                social: false
            }
        }
    },
    methods: {
        resetPassword(event) {
            event && event.preventDefault()
            if (!this.login.email) {
                return this.error = 'Please provide an email'
            }

            this.error = ''
            this.success = ''

            this.running.password = true
            this.$api.postReq('user/remind_password', {
                email: this.login.email
            }).then(res => {
                this.running.password = false
                this.success = 'Check your email for instructions'
            }).catch(res => {
                this.running.password = false

                var m = res.body.message
                this.error = 'We couldn`t find you account, perhaps you`ve logged in using social account?'
            })
        },
        loginEmail(event) {
            event && event.preventDefault()
            if (!this.login.email) {
                return this.error = 'Please provide an email'
            }
            if (!this.login.password) {
                return this.error = 'Please provide a password'
            }

            this.error = ''
            this.success = ''

            this.running.login = true
            this.$api.postReq('login/email', {
                email: this.login.email,
                password: this.login.password
            }).then(res => {
                this.running.login = false
                var m = res.body.message
                if (res.body.status) {
                    this.refreshUser(() => {
                        this.$api.area = 'restricted'
                        this.$router.push({ name: 'dashboard' })
                    })
                } else {
                    if (m === 'password_invalid') {
                        this.error = 'Password invalid'
                    }
                    if (m === 'user_not_found') {
                        this.error = 'User with given email not found'
                    }
                }
            })
        },
        registerEmail(event) {
            event.preventDefault()
            if (!this.register.email) {
                return this.error = 'Please provide an email'
            }
            if (this.register.email.indexOf("@") < 0) {
                return this.error = 'Please a valid email address'
            }
            if (!this.register.password) {
                return this.error = 'Please provide a password'
            }
            if (this.register.password.length < 6) {
                return this.error = 'Password must be at least 6 characters long'
            }
            if (this.register.password !== this.register.repeatPassword) {
                return this.error = 'Passwords are not the same'
            }

            this.error = ''
            this.success = ''

            this.running.register = true
            this.$api.postReq('register/email', {
                email: this.register.email,
                password: this.register.password
            }).then(res => {
                this.running.register = false
                var m = res.body.message

                if (m === 'user_registered') {
                    this.success = 'Registration successful!'
                    this.login.email = this.register.email
                    this.login.password = this.register.password
                    this.loginEmail()
                }
                if (m === 'user_exists') {
                    this.error = 'This email already has an account!'
                }
            }).catch(res => {

            })
        },
        loginSocial(_, provider) {
            this.running.social = true
            document.location.href = this.$api.getUrl().replace('restricted', 'auth') + provider
        }
    },
    mounted() {
        this.$api.area = 'public'

        if (this.$route.query.tab === 'r') {
            this.tab = 'register'
        }
        if (document.location.href.indexOf('localhost:8080') >= 0) {
            this.login.email = 'foobar1@gmail.com'
            this.login.password = 'foobar'
        }
    }
}
</script>
<style>
    .page-content{
        min-height: auto;
    }
</style>