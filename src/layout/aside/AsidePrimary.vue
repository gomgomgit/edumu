<script setup>
import { defineComponent, onMounted } from "vue";
import KTQuickLinksMenu from "@/layout/header/partials/QuickLinksMenu.vue";
import KTUserMenu from "@/layout/header/partials/UserMenu.vue";
import { useStore } from "vuex";

const emit = defineEmits(['openSubMenu', 'closeSubMenu'])

const store = useStore()
const userData = store.getters.currentUser

function openSubMenu(menu) {
  emit('openSubMenu', menu)
}

</script>

<template>
  <div
    class="aside-primary d-flex flex-column align-items-lg-center flex-row-auto"
  >
    <div
      class="aside-logo d-none d-lg-flex flex-column align-items-center flex-column-auto py-10"
      id="kt_aside_logo"
    >
      <a href="#">
        <img alt="Logo" src="media/logos/Logo-Edumu.png" class="h-64px" />
      </a>
    </div>

    <div
      class="aside-nav d-flex flex-column align-items-center flex-column-fluid w-100 pt-5 pt-lg-0"
      id="kt_aside_nav"
    >
      <div
        class="hover-scroll-y mb-10"
        data-kt-scroll="true"
        data-kt-scroll-activate="{default: false, lg: true}"
        data-kt-scroll-height="auto"
        data-kt-scroll-wrappers="#kt_aside_nav"
        data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
        data-kt-scroll-offset="0px"
      >
        <ul class="nav flex-column">
          <li
            class="nav-item mb-2"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-placement="right"
            data-bs-dismiss="click"
            data-bs-original-title="Projects"
          >
            <a
              class="nav-link btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light active"
              data-bs-toggle="tab"
              href="#kt_aside_nav_tab_projects"
              @mouseenter="openSubMenu('kt_aside_nav_tab_projects')"
            >
              <span class="svg-icon svg-icon-2x">
                <inline-svg src="media/icons/duotune/general/gen025.svg" />
              </span>
            </a>
          </li>

          <li
            class="nav-item mb-2"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-placement="right"
            data-bs-dismiss="click"
            data-bs-original-title="Lms"
          >
            <a
              class="nav-link btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light"
              data-bs-toggle="tab"
              href="#kt_aside_nav_tab_lms"
              @mouseenter="openSubMenu('kt_aside_nav_tab_lms')"
            >
              <span class="svg-icon svg-icon-2x">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  version="1.1"
                >
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <rect x="0" y="0" width="24" height="24" />
                    <path
                      d="M13.6855025,18.7082217 C15.9113859,17.8189707 18.682885,17.2495635 22,17 C22,16.9325178 22,13.1012863 22,5.50630526 L21.9999762,5.50630526 C21.9999762,5.23017604 21.7761292,5.00632908 21.5,5.00632908 C21.4957817,5.00632908 21.4915635,5.00638247 21.4873465,5.00648922 C18.658231,5.07811173 15.8291155,5.74261533 13,7 C13,7.04449645 13,10.79246 13,18.2438906 L12.9999854,18.2438906 C12.9999854,18.520041 13.2238496,18.7439052 13.5,18.7439052 C13.5635398,18.7439052 13.6264972,18.7317946 13.6855025,18.7082217 Z"
                      fill="currentColor"
                    />
                    <path
                      d="M10.3144829,18.7082217 C8.08859955,17.8189707 5.31710038,17.2495635 1.99998542,17 C1.99998542,16.9325178 1.99998542,13.1012863 1.99998542,5.50630526 L2.00000925,5.50630526 C2.00000925,5.23017604 2.22385621,5.00632908 2.49998542,5.00632908 C2.50420375,5.00632908 2.5084219,5.00638247 2.51263888,5.00648922 C5.34175439,5.07811173 8.17086991,5.74261533 10.9999854,7 C10.9999854,7.04449645 10.9999854,10.79246 10.9999854,18.2438906 L11,18.2438906 C11,18.520041 10.7761358,18.7439052 10.4999854,18.7439052 C10.4364457,18.7439052 10.3734882,18.7317946 10.3144829,18.7082217 Z"
                      fill="currentColor"
                      opacity="0.3"
                    />
                  </g>
                </svg>
              </span>
            </a>
          </li>

          <li
            class="nav-item mb-2"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-placement="right"
            data-bs-dismiss="click"
            data-bs-original-title="Sekolah"
          >
            <a
              class="nav-link btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light"
              data-bs-toggle="tab"
              href="#kt_aside_nav_tab_sekolah"
              @mouseenter="openSubMenu('kt_aside_nav_tab_sekolah')"
            >
              <span class="svg-icon svg-icon-2x">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  version="1.1"
                >
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <rect x="0" y="0" width="24" height="24" />
                    <path
                      d="M5.5,4 L18.5,4 C19.3284271,4 20,4.67157288 20,5.5 L20,9.5 C20,10.3284271 19.3284271,11 18.5,11 L5.5,11 C4.67157288,11 4,10.3284271 4,9.5 L4,5.5 C4,4.67157288 4.67157288,4 5.5,4 Z M11,6 C10.4477153,6 10,6.44771525 10,7 C10,7.55228475 10.4477153,8 11,8 L13,8 C13.5522847,8 14,7.55228475 14,7 C14,6.44771525 13.5522847,6 13,6 L11,6 Z"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <path
                      d="M5.5,13 L18.5,13 C19.3284271,13 20,13.6715729 20,14.5 L20,18.5 C20,19.3284271 19.3284271,20 18.5,20 L5.5,20 C4.67157288,20 4,19.3284271 4,18.5 L4,14.5 C4,13.6715729 4.67157288,13 5.5,13 Z M11,15 C10.4477153,15 10,15.4477153 10,16 C10,16.5522847 10.4477153,17 11,17 L13,17 C13.5522847,17 14,16.5522847 14,16 C14,15.4477153 13.5522847,15 13,15 L11,15 Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </span>
            </a>
          </li>

          <li
            class="nav-item mb-2"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-placement="right"
            data-bs-dismiss="click"
            data-bs-original-title="Iuran"
          >
            <a
              class="nav-link btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light"
              data-bs-toggle="tab"
              href="#kt_aside_nav_tab_iuran"
              @mouseenter="openSubMenu('kt_aside_nav_tab_iuran')"
            >
              <span class="svg-icon svg-icon-2x">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  version="1.1"
                >
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <rect x="0" y="0" width="24" height="24" />
                    <path
                      d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z"
                      fill="currentColor"
                      opacity="0.3"
                      transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "
                    />
                    <path
                      d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </span>
            </a>
          </li>

          <li
            class="nav-item mb-2"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-placement="right"
            data-bs-dismiss="click"
            data-bs-original-title="Absensi"
          >
            <a
              class="nav-link btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light"
              data-bs-toggle="tab"
              href="#kt_aside_nav_tab_absensi"
              @mouseenter="openSubMenu('kt_aside_nav_tab_absensi')"
            >
              <span class="svg-icon svg-icon-2x">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  version="1.1"
                >
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <rect x="0" y="0" width="24" height="24" />
                    <path
                      d="M6,2 L18,2 C19.6568542,2 21,3.34314575 21,5 L21,19 C21,20.6568542 19.6568542,22 18,22 L6,22 C4.34314575,22 3,20.6568542 3,19 L3,5 C3,3.34314575 4.34314575,2 6,2 Z M12,11 C13.1045695,11 14,10.1045695 14,9 C14,7.8954305 13.1045695,7 12,7 C10.8954305,7 10,7.8954305 10,9 C10,10.1045695 10.8954305,11 12,11 Z M7.00036205,16.4995035 C6.98863236,16.6619875 7.26484009,17 7.4041679,17 C11.463736,17 14.5228466,17 16.5815,17 C16.9988413,17 17.0053266,16.6221713 16.9988413,16.5 C16.8360465,13.4332455 14.6506758,12 11.9907452,12 C9.36772908,12 7.21569918,13.5165724 7.00036205,16.4995035 Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </span>
            </a>
          </li>

          <li
            class="nav-item mb-2"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            data-bs-placement="right"
            data-bs-dismiss="click"
            data-bs-original-title="Pengaturan"
          >
            <a
              class="nav-link btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light"
              data-bs-toggle="tab"
              href="#kt_aside_nav_tab_pengaturan"
              @mouseenter="openSubMenu('kt_aside_nav_tab_pengaturan')"
            >
              <span class="svg-icon svg-icon-2x">
                <inline-svg src="media/icons/duotune/general/gen019.svg" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="aside-footer d-flex flex-column align-items-center flex-column-auto"
      id="kt_aside_footer"
    >
      <div class="d-flex align-items-center mb-3">
        <div
          class="btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light"
          data-kt-menu-trigger="click"
          data-kt-menu-overflow="true"
          data-kt-menu-placement="top-start"
          data-kt-menu-flip="top-end"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-dismiss="click"
          title="Quick links"
        >
          <span class="svg-icon svg-icon-2 svg-icon-lg-1">
            <inline-svg src="media/icons/duotune/general/gen022.svg" />
          </span>
        </div>
        <KTQuickLinksMenu></KTQuickLinksMenu>
      </div>
      <div
        class="d-flex align-items-center mb-6"
        id="kt_header_user_menu_toggle"
      >
        <div
          class="cursor-pointer symbol symbol-40px"
          data-kt-menu-trigger="click"
          data-kt-menu-overflow="true"
          data-kt-menu-placement="top-start"
          data-kt-menu-flip="top-end"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-dismiss="click"
          title="User profile"
        >
          <img :src="userData.sekolah_foto" alt="metronic" />
        </div>
        <KTUserMenu></KTUserMenu>
      </div>
      
    </div>
  </div>
</template>
