<template>
  <div class="h-100">
    <KTLoader v-if="loaderEnabled" :logo="loaderLogo" />
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import QueryString from "qs";
import KTLoader from "@/components/Loader.vue";
import {
  loaderEnabled,
  loaderLogo,
} from "@/core/helpers/config";
import { async } from "validate.js";
import { inject } from 'vue'

const store = useStore();
const router = useRouter();
const route = useRoute();

const cryoptojs = inject('cryptojs')

const loginData = route.query.data;
store.dispatch(Actions.ADD_BODY_CLASSNAME, "page-loading");

function loginProcess() {

  var bytes = cryoptojs.AES.decrypt(loginData.replace(/ /g, '+'), "edumuv2").toString(cryoptojs.enc.Utf8)
  var data = QueryString.parse(bytes);

  store.dispatch(Actions.LOGIN, data)
}
onMounted(async() => {
  await loginProcess()
  
  setTimeout(() => {
    // store.dispatch(Actions.REMOVE_BODY_CLASSNAME, "page-loading");
    router.push({ name: "dashboard" });
  }, 500);
})
</script>
