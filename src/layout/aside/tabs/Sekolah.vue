<template>
  <!--begin::Header-->
  <div class="card-header border-0 pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder text-dark">Sekolah</span>
    </h3>
  </div>
  <!--end::Header-->

  <!--begin::Menu wrapper-->
  <div
    id="kt_aside_menu_wrapper"
    ref="scrollElRef"
    class="hover-scroll-overlay-y my-5 my-lg-5"
    data-kt-scroll="true"
    data-kt-scroll-activate="{default: false, lg: true}"
    data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
    data-kt-scroll-height="auto"
    data-kt-scroll-offset="0"
    data-kt-scroll-wrappers="#kt_aside_menu"
  >
    <!--begin::Menu-->

    <div
      id="#kt_header_menu"
      class="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
      data-kt-menu="true"
    >
      <template v-for="(item, i) in MainMenuConfig" :key="i">
        <div v-if="item.heading" class="menu-item">
          <div class="menu-content pt-8 pb-2">
            <span class="menu-section text-muted text-uppercase fs-8 ls-1">
              {{ translate(item.heading) }}
            </span>
          </div>
        </div>
        <template v-for="(menuItem, j) in item.pages" :key="j">
          <template v-if="menuItem.heading">
            <div class="menu-item">
              <router-link
                class="menu-link"
                active-class="active"
                :to="menuItem.route"
              >
                <span
                  v-if="menuItem.svgIcon || menuItem.fontIcon"
                  class="menu-icon"
                >
                  <i
                    v-if="asideMenuIcons === 'font'"
                    :class="menuItem.fontIcon"
                    class="bi fs-3"
                  ></i>
                  <span
                    v-else-if="asideMenuIcons === 'svg'"
                    class="svg-icon svg-icon-2"
                  >
                    <inline-svg :src="menuItem.svgIcon" />
                  </span>
                </span>
                <span class="menu-title">{{
                  translate(menuItem.heading)
                }}</span>
              </router-link>
            </div>
          </template>
          <div
            v-if="menuItem.sectionTitle"
            :class="{ show: hasActiveChildren(menuItem.route) }"
            class="menu-item menu-accordion position-relative"
            data-kt-menu-sub="accordion"
            data-kt-menu-trigger="hover"
            @mouseenter="showSubMenu"
            @mouseleave="hideSubMenu"
            @click="clickSubMenu"
          >
            <span class="menu-link">
              <span
                v-if="menuItem.svgIcon || menuItem.fontIcon"
                class="menu-icon"
              >
                <i
                  v-if="asideMenuIcons === 'font'"
                  :class="menuItem.fontIcon"
                  class="bi fs-3"
                ></i>
                <span
                  v-else-if="asideMenuIcons === 'svg'"
                  class="svg-icon svg-icon-2"
                >
                  <inline-svg :src="menuItem.svgIcon" />
                </span>
              </span>
              <span class="menu-title">{{
                translate(menuItem.sectionTitle)
              }}</span>
              <span class="menu-arrow"></span>
            </span>
            <div
              :class="{ show: hasActiveChildren(menuItem.route) }"
              class="menu-sub menu-sub-accordion"
            >
              <template v-for="(item2, k) in menuItem.sub" :key="k">
                <div v-if="item2.heading" class="menu-item">
                  <router-link
                    class="menu-link"
                    active-class="active"
                    :to="item2.route"
                  >
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(item2.heading)
                    }}</span>
                  </router-link>
                </div>
                <div
                  v-if="item2.sectionTitle"
                  :class="{ show: hasActiveChildren(item2.route) }"
                  class="menu-item menu-accordion"
                  data-kt-menu-sub="accordion"
                  data-kt-menu-trigger="click"
                >
                  <span class="menu-link">
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(item2.sectionTitle)
                    }}</span>
                    <span class="menu-arrow"></span>
                  </span>
                  <div
                    :class="{ show: hasActiveChildren(item2.route) }"
                    class="menu-sub menu-sub-accordion"
                  >
                    <template v-for="(item3, k) in item2.sub" :key="k">
                      <div v-if="item3.heading" class="menu-item">
                        <router-link
                          class="menu-link"
                          active-class="active"
                          :to="item3.route"
                        >
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                          <span class="menu-title">{{
                            translate(item3.heading)
                          }}</span>
                        </router-link>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>
    </div>
    <!--end::Menu-->

  </div>
  <!--end::Menu wrapper-->
</template>

<style scoped>
.menu-sub.menu-sub-accordion {
  height: 0;
  max-height: 0;
  display: block;
  overflow: hidden;
  transition: all .4s ease-in-out;
}
.menu-sub.menu-sub-accordion.show {
  height: 100%;
  max-height: 150px;
  overflow: hidden;
  transition: all .4s ease-in;
}
</style>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n/index";
import { useRoute } from "vue-router";
import { version } from "@/core/helpers/documentation";
import { asideMenuIcons } from "@/core/helpers/config";

export default defineComponent({
  name: "kt-menu",
  components: {},
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const scrollElRef = ref<null | HTMLElement>(null);

    const MainMenuConfig = [
      {
        pages: [
          {
            sectionTitle: "Profil Pengguna",
            route: "/pages",
            svgIcon: "media/icons/duotune/general/gen022.svg",
            fontIcon: "bi-archive",
            sub: [
              {
                heading: "Siswa",
                route: "/sekolah/profil-pengguna/siswa",
              },
              {
                heading: "Wali",
                route: "/sekolah/profil-pengguna/wali",
              },
              {
                heading: "Guru",
                route: "/sekolah/profil-pengguna/guru",
              },
            ],
          },
          {
            sectionTitle: "Akademik",
            svgIcon: "media/icons/duotune/general/gen022.svg",
            fontIcon: "bi-archive",
            sub: [
              {
                heading: "Tahun Ajar",
                route: "/sekolah/akademik/tahun-ajar",
              },
              {
                heading: "Data Kelas",
                route: "/sekolah/akademik/data-kelas",
              },
              {
                heading: "Kalender Akademik",
                route: "/sekolah/akademik/kalender-akademik",
              },
            ],
          },
          {
            sectionTitle: "Mata Pelajaran",
            route: "/pages",
            svgIcon: "media/icons/duotune/general/gen022.svg",
            fontIcon: "bi-archive",
            sub: [
              {
                heading: "Data Mapel",
                route: "/sekolah/mata-pelajaran/data-mapel",
              },
              {
                heading: "Jadwal Pelajaran",
                route: "/sekolah/mata-pelajaran/jadwal-pelajaran",
              },
            ],
          },
          {
            sectionTitle: "Informasi",
            route: "/pages",
            svgIcon: "media/icons/duotune/general/gen022.svg",
            fontIcon: "bi-archive",
            sub: [
              {
                heading: "Pengumuman",
                route: "/sekolah/informasi/pengumuman",
              },
              {
                heading: "Prestasi Sekolah",
                route: "/sekolah/informasi/prestasi",
              },
              {
                heading: "Event Sekolah",
                route: "/sekolah/informasi/event",
              },
              {
                heading: "Berita",
                route: "/sekolah/informasi/berita",
              },
            ],
          },
          {
            heading: "E Dokumen",
            route: "/sekolah/e-document",
            svgIcon: "media/icons/duotune/general/gen022.svg",
            fontIcon: "bi-archive",
          },
          {
            sectionTitle: "Laporan",
            route: "/pages",
            svgIcon: "media/icons/duotune/general/gen022.svg",
            fontIcon: "bi-archive",
            sub: [
              {
                heading: "User Online",
                route: "/sekolah/laporan/user-online",
              },
              // {
              //   heading: "Kartu Aktifitas",
              //   route: "/profile",
              // },
            ]
          },
          {
            heading: "Akreditasi",
            route: "/sekolah/akreditasi",
            svgIcon: "media/icons/duotune/general/gen022.svg",
            fontIcon: "bi-archive",
          },
          {
            heading: "Media",
            route: "/sekolah/media",
            svgIcon: "media/icons/duotune/general/gen022.svg",
            fontIcon: "bi-archive",
          },
        ],
      },
    ];

    onMounted(() => {
      if (scrollElRef.value) {
        scrollElRef.value.scrollTop = 0;
      }
    });

    const translate = (text) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    const hasActiveChildren = (match) => {
      return route.path.indexOf(match) !== -1;
    };

    function showSubMenu(event) {
      event.target.classList.add('show', 'hover')
      event.target.getElementsByClassName('menu-sub')[0].classList.add('show')
    }
    function hideSubMenu(event) {
      event.target.classList.remove('show', 'hover')
      event.target.getElementsByClassName('menu-sub')[0].classList.remove('show')
    }

    function clickSubMenu(event) {
      const oldMenu = document.querySelectorAll('.menu-item.show')
      if (oldMenu.length > 0) {
        oldMenu[0].classList.remove('show', 'hover')
        oldMenu[0].getElementsByClassName('menu-sub')[0].classList.remove('show')
      } else {
        const menu = event.target.closest('.menu-item')
        menu.classList.add('show', 'hover')
        menu.getElementsByClassName('menu-sub')[0].classList.add('show')
      }


    }

    return {
      hasActiveChildren,
      MainMenuConfig,
      asideMenuIcons,
      version,
      translate,
      showSubMenu,
      hideSubMenu,
      clickSubMenu,
    };
  },
});
</script>
