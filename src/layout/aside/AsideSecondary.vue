
<script setup>
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n/index";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import KTEdumu from "@/layout/aside/tabs/Edumu.vue";
import KTLms from "@/layout/aside/tabs/Lms.vue";
import KTSekolah from "@/layout/aside/tabs/Sekolah.vue";
import KTIuran from "@/layout/aside/tabs/Iuran.vue";
import KTAbsensi from "@/layout/aside/tabs/Absensi.vue";
import KTPengaturan from "@/layout/aside/tabs/Pengaturan.vue";
import {
  minimizedAsideSecondary,
  asideSecondaryDisplay,
  minimizationEnabled,
} from "@/core/helpers/config";
import { getIllustrationsPath } from "@/core/helpers/assets";

const { t } = useI18n();

const emit = defineEmits(['togglePin', 'openAside', 'closeAside'])
</script>

<template>
  <div v-if="asideSecondaryDisplay" class="aside-secondary d-flex flex-row-fluid" @mouseenter="emit('openAside')"
    @mouseleave="emit('closeAside')">
    <div class="aside-workspace my-5 p-5" id="kt_aside_wordspace">
      <div class="d-flex h-100 flex-column">
        <div 
          class="flex-column-fluid hover-scroll-y" 
          data-kt-scroll="true" 
          data-kt-scroll-activate="true"
          data-kt-scroll-height="auto" 
          data-kt-scroll-wrappers="#kt_aside_wordspace"
          data-kt-scroll-dependencies="#kt_aside_secondary_footer" 
          data-kt-scroll-offset="0px">
          <div class="tab-content">
            <!-- <div class="submenus tab-pane fade active show" id="kt_aside_nav_tab_projects" role="tabpanel">
              <div class="m-0">
                <div class="m-0">
                  <h1 class="text-gray-800 fw-bold mb-6 mx-5">eduMU+</h1>

                  <div class="mb-10">
                    <router-link to="/dashboard" class="custom-list d-flex align-items-center px-5 py-4">
                      <div class="symbol symbol-50px me-5">
                        <span :class="`bg-light-success`" class="symbol-label">
                          <span
                            :class="`svg-icon-success`"
                            class="svg-icon svg-icon-2x"
                          >
                            <inline-svg src="media/icons/duotune/technology/teh004.svg" />
                          </span>
                        </span>
                      </div>

                      <div class="d-flex flex-column flex-grow-1">
                        <h5 class="custom-list-title fw-bold text-gray-800 mb-1">
                          Mesin Absensi Pintar
                        </h5>

                        <span class="text-gray-400 fw-bold">Untuk siswa & guru</span>
                      </div>
                    </router-link>

                    <router-link to="/dashboard" class="custom-list d-flex align-items-center px-5 py-4">
                      <div class="symbol symbol-50px me-5">
                        <span :class="`bg-light-danger`" class="symbol-label">
                          <span
                            :class="`svg-icon-danger`"
                            class="svg-icon svg-icon-2x"
                          >
                            <inline-svg src="media/icons/duotune/electronics/elc004.svg" />
                          </span>
                        </span>
                      </div>

                      <div class="d-flex flex-column flex-grow-1">
                        <h5 class="custom-list-title fw-bold text-gray-800 mb-1">
                          Website Sekolah
                        </h5>

                        <span class="text-gray-400 fw-bold">Publikasi informasi sekolah</span>
                      </div>
                    </router-link>

                    <router-link to="/dashboard" class="custom-list d-flex align-items-center px-5 py-4">
                      <div class="symbol symbol-50px me-5">
                        <span :class="`bg-light-primary`" class="symbol-label">
                          <span
                            :class="`svg-icon-primary`"
                            class="svg-icon svg-icon-2x"
                          >
                            <inline-svg src="media/icons/duotune/technology/teh009.svg" />
                          </span>
                        </span>
                      </div>

                      <div class="d-flex flex-column flex-grow-1">
                        <h5 class="custom-list-title fw-bold text-gray-800 mb-1">
                          CCTV Sekolah 
                        </h5>

                        <span class="text-gray-400 fw-bold">Akses dalam satu aplikasi</span>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
            </div> -->

            <div class="submenus tab-pane fade active show" id="kt_aside_nav_tab_edumu" role="tabpanel">
              <KTEdumu></KTEdumu>
            </div>

            <div class="submenus tab-pane fade" id="kt_aside_nav_tab_lms" role="tabpanel">
              <KTLms></KTLms>
            </div>

            <div class="submenus tab-pane fade" id="kt_aside_nav_tab_sekolah" role="tabpanel">
              <KTSekolah></KTSekolah>
            </div>

            <div class="submenus tab-pane fade" id="kt_aside_nav_tab_iuran" role="tabpanel">
              <KTIuran></KTIuran>
            </div>

            <div class="submenus tab-pane fade" id="kt_aside_nav_tab_absensi" role="tabpanel">
              <KTAbsensi></KTAbsensi>
            </div>

            <div class="submenus tab-pane fade" id="kt_aside_nav_tab_pengaturan" role="tabpanel">
              <KTPengaturan></KTPengaturan>
            </div>
          </div>

        </div>
        <div class="flex-column-auto pt-10 px-5" id="kt_aside_secondary_footer">
          <router-link :to="'/dokumentasi-pengguna'"
            class="btn btn-bg-light btn-color-gray-600 btn-flex btn-active-color-primary flex-center w-100"
            data-bs-toggle="tooltip" data-bs-custom-class="tooltip-dark" data-bs-trigger="hover" data-bs-offset="0,5"
            data-bs-dismiss-="click">
            <span class="btn-label">{{ t("Dokumentasi Pengguna") }}</span>
            <span class="svg-icon btn-icon svg-icon-4 ms-2">
              <inline-svg src="media/icons/duotune/general/gen005.svg" />
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <button v-if="asideSecondaryDisplay && minimizationEnabled"
    class="btn btn-sm btn-icon btn-primary position-absolute translate-middle start-100 end-0 bottom-0 shadow-sm d-none d-lg-flex"
    data-kt-toggle="true" data-kt-toggle-state="active" data-kt-toggle-target="body" data-kt-toggle-name="main-minimize"
    style="margin-bottom: 1.35rem" @click="emit('togglePin')">
    <span class="svg-icon svg-icon-2 rotate-180">
      <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
    </span>
  </button>
</template>