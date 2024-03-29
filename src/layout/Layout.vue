<template>
  <KTLoader v-if="loaderEnabled" :logo="loaderLogo" />

  <!-- begin:: Body -->
  <div class="page d-flex flex-row flex-column-fluid">
    <!-- begin:: Aside Left -->
    <KTAside
      v-if="asideEnabled"
      :lightLogo="themeLightLogo"
      :darkLogo="themeDarkLogo"
    />
    <!-- end:: Aside Left -->

    <div id="kt_wrapper" class="wrapper d-flex flex-column flex-row-fluid">
      <KTHeader :title="pageTitle" :breadcrumbs="breadcrumbs" />

      <!-- begin:: Content -->
      <div id="kt_content" class="content d-flex flex-column flex-column-fluid">
        <!-- begin:: Content Body -->
        <div
          id="kt_content_container"
          :class="{
            'container-fluid': contentWidthFluid,
            'container-xxl': !contentWidthFluid,
          }"
        >
          <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition || 'slide-fade'">
              <component :is="Component"/>
            </transition>
          </router-view> 
        </div>
        <!-- end:: Content Body -->
      </div>
      <!-- end:: Content -->
      <KTFooter />
    </div>
  </div>
  <!-- end:: Body -->
  <KTScrollTop />
  <!-- <KTMessengerDrawer /> -->
  <KTUserMenu />
  <!-- <KTCreateApp /> -->
  <!-- <KTInviteFriendsModal /> -->
  <!-- <KTUpgradePlanModal /> -->

  <!-- <KTToolbarButtons /> -->
  <!-- <KTDemosDrawer /> -->
  <!-- <KTHelpDrawer /> -->
</template>

<style>
  .slide-fade-enter-active {
    opacity: 100;
    transition: all 0.4s ease-out;
  }

  .slide-fade-leave-active {
    opacity: 100;
    transition: all .4s cubic-bezier(1, 0.5, 0.8, 1), 2;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(40px);
    opacity: 0;
  }
</style>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import KTAside from "@/layout/aside/Aside.vue";
import KTHeader from "@/layout/header/Header.vue";
import KTFooter from "@/layout/footer/Footer.vue";
import HtmlClass from "@/core/services/LayoutService";
import KTScrollTop from "@/layout/extras/ScrollTop.vue";
import KTUserMenu from "@/layout/header/partials/ActivityDrawer.vue";
import KTLoader from "@/components/Loader.vue";
import KTCreateApp from "@/components/modals/wizards/CreateAppModal.vue";
import KTInviteFriendsModal from "@/components/modals/general/InviteFriendsModal.vue";
import KTUpgradePlanModal from "@/components/modals/general/UpgradePlanModal.vue";
import KTToolbarButtons from "@/layout/extras/ToolbarButtons.vue";
import KTDemosDrawer from "@/layout/extras/DemosDrawer.vue";
import KTHelpDrawer from "@/layout/extras/HelpDrawer.vue";
import KTMessengerDrawer from "@/layout/extras/MessengerDrawer.vue";
import { Actions } from "@/store/enums/StoreEnums";
import { MenuComponent } from "@/assets/ts/components";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import { removeModalBackdrop } from "@/core/helpers/dom";
import {
  toolbarDisplay,
  loaderEnabled,
  contentWidthFluid,
  loaderLogo,
  asideEnabled,
  subheaderDisplay,
  themeLightLogo,
  themeDarkLogo,
} from "@/core/helpers/config";

export default defineComponent({
  name: "master-layout",
  components: {
    KTAside,
    KTHeader,
    KTFooter,
    KTScrollTop,
    KTCreateApp,
    KTInviteFriendsModal,
    KTUpgradePlanModal,
    KTUserMenu,
    KTToolbarButtons,
    KTDemosDrawer,
    KTHelpDrawer,
    KTMessengerDrawer,
    KTLoader,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const loginUrl = process.env.VUE_APP_LOGIN_URL

    // show page loading
    if (!loaderEnabled) {
      store.dispatch(Actions.ADD_BODY_CLASSNAME, "page-loading");
    }

    // initialize html element classes
    HtmlClass.init();

    const pageTitle = computed(() => {
      return store.getters.pageTitle;
    });

    const breadcrumbs = computed(() => {
      return store.getters.pageBreadcrumbPath;
    });

    onMounted(() => {
      //check if current user is authenticated
      if (!store.getters.isUserAuthenticated) {
          window.location.href = loginUrl;
      }

      nextTick(() => {
        reinitializeComponents();
      });

      // Simulate the delay page loading
      setTimeout(() => {
        // Remove page loader after some time
        store.dispatch(Actions.REMOVE_BODY_CLASSNAME, "page-loading");
      }, 500);
    });

    watch(
      () => route.path,
      () => {
        MenuComponent.hideDropdowns(undefined);

        // check if current user is authenticated
        if (!store.getters.isUserAuthenticated) {
          window.location.href = loginUrl;
        }

        nextTick(() => {
          reinitializeComponents();
        });
        removeModalBackdrop();
      }
    );

    return {
      toolbarDisplay,
      loaderEnabled,
      contentWidthFluid,
      loaderLogo,
      asideEnabled,
      subheaderDisplay,
      pageTitle,
      breadcrumbs,
      themeLightLogo,
      themeDarkLogo,
    };
  },
});
</script>
