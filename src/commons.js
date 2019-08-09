import Vue from 'vue'
import OnboardMessages from './components/common/OnboardMessages'

Vue.component('onboard-messages', OnboardMessages)

Vue.component('settings-counter', {
    template: `
    <div class="col-3" :class="loading">
        <div class="text-uppercase font-size-xs text-muted">{{label}}</div>
        <h5 class="font-weight-semibold line-height-1 mt-1 mb-0">
            {{v}}
        </h5>
    </div>
    `,
    props: {
        label: null,
        value: 0,
        filter: ''
    },
    computed: {
        v(){
            
            let v = this.value
            if(this.filter){
                v = Vue.options.filters[this.filter](this.value)
            }

            return this.value === false ? '-' : v
        },
        loading(){
            return this.value === false ? 'loading-mask': ''
        }
    }
})

Vue.component('dashboard-counter', {
    template: `
    <div :class="colClass">
        <div class="card card-body" :class="loading">
            <div class="media">
                <div class="mr-3 align-self-center">
                    <i :class="'icon-'+icon+' text-'+color+'-400'" class="icon-3x"></i>
                </div>

                <div class="media-body text-right">
                    <h3 class="font-weight-semibold mb-0">{{v|thousands}}</h3>
                    <span class="text-uppercase font-size-sm text-muted">
                        {{label}}
                    </span>
                </div>
            </div>
        </div>
    </div>
    `,
    props: {
        icon: null,
        label: null,
        value: 0,
        color: {type: String, default: 'success'},
        colClass: {type: String, default:'col-sm-6 col-xl-3'}
    },
    computed: {
        v(){
            return this.value === false ? '-' : this.value
        },
        loading(){
            return this.value === false ? 'loading-mask': ''
        }
    }
});