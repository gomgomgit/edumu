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

const store = useStore();
const router = useRouter();
const route = useRoute();

const loginData = route.params.data;
store.dispatch(Actions.ADD_BODY_CLASSNAME, "page-loading");

function loginProcess() {
  var data = QueryString.parse(loginData)
  store.dispatch(Actions.LOGIN, data)

  // Swal.fire({
  //   text: "You have successfully logged in!",
  //   icon: "success",
  //   buttonsStyling: false,
  //   confirmButtonText: "Ok, got it!",
  //   customClass: {
  //     confirmButton: "btn fw-bold btn-light-primary",
  //   },
  //   }).then(function () {
  //     router.push({ name: "dashboard" });
  // });
}
onMounted(async() => {
  await loginProcess()
  
  setTimeout(() => {
    // store.dispatch(Actions.REMOVE_BODY_CLASSNAME, "page-loading");
    router.push({ name: "dashboard" });
  }, 500);
})
</script>
