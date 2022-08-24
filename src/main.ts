import { createApp } from "vue";
import App from "./App.vue";

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import VueToast from 'vue-toast-notification';
import CKEditor from '@ckeditor/ckeditor5-vue';

import "@/core/plugins/prismjs";
import "bootstrap";
import 'vue-toast-notification/dist/theme-default.css';
import VueCryptojs from 'vue-cryptojs'

const app = createApp(App);

const currentUser = store.getters.currentUser;

app.use(store);
app.use(router);
app.use(ElementPlus);
app.use(VueToast);
app.use(CKEditor);
app.use(VueCryptojs);

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initVeeValidate();

app.use(i18n);

app.mount("#app");
