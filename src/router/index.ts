import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { Mutations, Actions } from "@/store/enums/StoreEnums";
import JwtService from "@/core/services/JwtService";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "/lms/tugas-offline",
        name: "lms-tugas-offline",
        component: () => import("@/views/lms/tugas-offline/Index.vue"),
      },
      {
        path: "/lms/tugas-offline/:type/:id?",
        name: "lms-tugas-offline-data",
        component: () => import("@/views/lms/tugas-offline/Data.vue"),
      },
      {
        path: "/lms/tugas-offline/detail/:id?",
        name: "lms-tugas-offline-detail",
        component: () => import("@/views/lms/tugas-offline/Detail.vue"),
      },
      {
        path: "/lms/tugas-offline/detail/answer/:id?",
        name: "lms-tugas-offline-detail-answer",
        component: () => import("@/views/lms/tugas-offline/Answer.vue"),
      },
      {
        path: "/lms/ujian-online",
        name: "lms-ujian-online",
        component: () => import("@/views/lms/ujian-online/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/lms/ujian-online/utama",
          },
          {
            path: "utama",
            name: "lms-ujian-online-utama",
            component: () => import("@/views/lms/ujian-online/utama/Index.vue"),
            children: [
              {
                path: "",
                name: "lms-ujian-online-utama-main",
                component: () => import("@/views/lms/ujian-online/utama/Main.vue"),
              },
              {
                path: "form",
                name: "lms-ujian-online-utama-form",
                component: () => import("@/views/lms/ujian-online/utama/Form.vue"),
                children: [
                  {
                    path: "",
                    redirect: "/lms/ujian-online/utama/form/pengaturan"
                  },
                  {
                    path: "pengaturan/:id?",
                    name: "lms-ujian-online-utama-form-pengaturan",
                    component: () => import("@/views/lms/ujian-online/utama/form/Pengaturan.vue")
                  },
                  {
                    path: "soal-ujian/:id?",
                    name: "lms-ujian-online-utama-form-soal-ujian",
                    component: () => import("@/views/lms/ujian-online/utama/form/SoalUjian.vue"),
                  },
                  {
                    path: "pratinjau/:id?",
                    name: "lms-ujian-online-utama-form-pratinjau",
                    component: () => import("@/views/lms/ujian-online/utama/form/Pratinjau.vue"),
                  },
                ]
              },
            ],
          },
          {
            path: "pantau-ujian",
            name: "lms-ujian-online-pantau-ujian",
            component: () => import("@/views/lms/ujian-online/pantau-ujian/Index.vue"),
          },
          {
            path: "kategori",
            name: "lms-ujian-online-kategori",
            component: () => import("@/views/lms/ujian-online/kategori/Index.vue"),
          },
        ]
      },
      {
        path: "/lms/ujian-online/pantau-ujian/detail/:id",
        name: "lms-ujian-online-pantau-ujian-detail",
        component: () => import("@/views/lms/ujian-online/pantau-ujian/Detail.vue"),
      },

      {
        path: "/lms/bank-soal",
        name: "lms-bank-soal",
        component: () => import("@/views/lms/bank-soal/Index.vue")
      },
      {
        path: "/lms/bank-soal/import",
        name: "lms-bank-soal-import",
        component: () => import("@/views/lms/bank-soal/Import.vue")
      },
      {
        path: "/lms/bank-soal/:type/:id?",
        name: "lms-bank-soal-data",
        component: () => import("@/views/lms/bank-soal/Data.vue")
      },
      {
        path: "/lms/bank-soal/detail/:id?",
        name: "lms-bank-soal-detail",
        component: () => import("@/views/lms/bank-soal/Detail.vue")
      },

      {
        path: "/lms/materi-belajar",
        name: "lms-materi-belajar",
        component: () => import("@/views/lms/materi-belajar/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/lms/materi-belajar/video",
          },
          {
            path: "video",
            name: "lms-materi-belajar-video",
            component: () =>
              import("@/views/lms/materi-belajar/video/Index.vue"),
          },
          {
            path: "file",
            name: "lms-materi-belajar-file",
            component: () =>
              import("@/views/lms/materi-belajar/file/Index.vue"),
          },
        ],
      },
      {
        path: "/lms/materi-belajar/video/:type/:id?",
        name: "lms-materi-belajar-video-data",
        component: () => import("@/views/lms/materi-belajar/video/Data.vue"),
      },
      {
        path: "/lms/materi-belajar/file/:type/:id?",
        name: "lms-materi-belajar-file-data",
        component: () => import("@/views/lms/materi-belajar/file/Data.vue"),
      },
      {
        path: "/lms/laporan-nilai",
        name: "lms-laporan-nilai",
        component: () => import("@/views/lms/laporan-nilai/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/lms/laporan-nilai/tugas-online",
          },
          {
            path: "tugas-online",
            name: "lms-laporan-nilai-tugas-online",
            component: () =>
              import("@/views/lms/laporan-nilai/tugas-online/Index.vue"),
          },
          {
            path: "tugas-offline",
            name: "lms-laporan-nilai-tugas-offline",
            component: () =>
              import("@/views/lms/laporan-nilai/tugas-offline/Index.vue"),
          },
        ],
      },
      {
        path: "/lms/laporan-nilai/tugas-online/detail/:id",
        name: "lms-laporan-nilai-tugas-online-detail",
        component: () => import("@/views/lms/laporan-nilai/tugas-online/Detail.vue"),
      },
      {
        path: "/lms/laporan-nilai/tugas-online/export/:id/:kelas",
        name: "lms-laporan-nilai-tugas-online-export",
        component: () => import("@/views/lms/laporan-nilai/tugas-online/Export.vue"),
      },
      {
        path: "/lms/laporan-nilai/tugas-offline/detail/:id",
        name: "lms-laporan-nilai-tugas-offline-detail",
        component: () => import("@/views/lms/laporan-nilai/tugas-offline/Detail.vue"),
      },

      //Sekolah

      //Profil Pengguna
      {
        path: "/sekolah/profil-pengguna/siswa",
        name: "sekolah-profil-pengguna-siswa",
        component: () => import("@/views/sekolah/profil-pengguna/siswa/Index.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/siswa/import-data",
        name: "sekolah-profil-pengguna-siswa-import",
        component: () => import("@/views/sekolah/profil-pengguna/siswa/Import.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/siswa/tambah-data",
        name: "sekolah-profil-pengguna-siswa-tambah",
        component: () => import("@/views/sekolah/profil-pengguna/siswa/Tambah.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/siswa/edit-data/:id",
        name: "sekolah-profil-pengguna-siswa-edit",
        component: () => import("@/views/sekolah/profil-pengguna/siswa/Edit.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/wali",
        name: "sekolah-profil-pengguna-wali",
        component: () => import("@/views/sekolah/profil-pengguna/wali/Index.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/wali/tambah-data",
        name: "sekolah-profil-pengguna-wali-tambah",
        component: () => import("@/views/sekolah/profil-pengguna/wali/Tambah.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/wali/edit-data/:id",
        name: "sekolah-profil-pengguna-wali-edit",
        component: () => import("@/views/sekolah/profil-pengguna/wali/Edit.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/guru",
        name: "sekolah-profil-pengguna-guru",
        component: () => import("@/views/sekolah/profil-pengguna/guru/Index.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/guru/import-data",
        name: "sekolah-profil-pengguna-guru-import",
        component: () => import("@/views/sekolah/profil-pengguna/guru/Import.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/guru/tambah-data",
        name: "sekolah-profil-pengguna-guru-tambah",
        component: () => import("@/views/sekolah/profil-pengguna/guru/Tambah.vue"),
      },
      {
        path: "/sekolah/profil-pengguna/guru/edit-data/:id",
        name: "sekolah-profil-pengguna-guru-edit",
        component: () => import("@/views/sekolah/profil-pengguna/guru/Edit.vue"),
      },
      {
        path: "/sekolah/akademik/tahun-ajar",
        name: "sekolah-akademik-tahun-ajar",
        component: () => import("@/views/sekolah/akademik/tahun-ajar/Index.vue"),
      },
      {
        path: "/sekolah/akademik/data-kelas",
        name: "sekolah-akademik-data-kelas",
        component: () => import("@/views/sekolah/akademik/data-kelas/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/sekolah/akademik/data-kelas/utama",
          },
          {
            path: "utama",
            name: "sekolah-akademik-data-kelas-utama",
            component: () =>
              import("@/views/sekolah/akademik/data-kelas/tabs/Utama.vue"),
          },
          {
            path: "wali-kelas",
            name: "sekolah-akademik-data-kelas-wali-kelas",
            component: () =>
              import("@/views/sekolah/akademik/data-kelas/tabs/WaliKelas.vue"),
          },
          {
            path: "mutasi-kelas",
            name: "sekolah-akademik-data-kelas-mutasi-kelas",
            component: () =>
              import("@/views/sekolah/akademik/data-kelas/tabs/MutasiKelas.vue"),
          },
        ],
      },
      {
        path: "/sekolah/akademik/kalender-akademik",
        name: "sekolah-akademik-kalender-akademik",
        component: () => import("@/views/sekolah/akademik/kalender-akademik/Index.vue"),
      },
      {
        path: "/sekolah/akademik/kalender-akademik/import",
        name: "sekolah-akademik-kalender-akademik-import",
        component: () => import("@/views/sekolah/akademik/kalender-akademik/Import.vue"),
      },
      {
        path: "/sekolah/akademik/kalender-akademik/tambah",
        name: "sekolah-akademik-kalender-akademik-tambah",
        component: () => import("@/views/sekolah/akademik/kalender-akademik/FormData.vue"),
      },
      {
        path: "/sekolah/akademik/kalender-akademik/edit/:id",
        name: "sekolah-akademik-kalender-akademik-edit",
        component: () => import("@/views/sekolah/akademik/kalender-akademik/FormData.vue"),
      },
      {
        path: "/sekolah/mata-pelajaran",
        name: "sekolah-mata-pelajaran",
        component: () => import("@/views/sekolah/mata-pelajaran/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/sekolah/mata-pelajaran/data-mapel"
          },
          {
            path: "data-mapel",
            name: "sekolah-mata-pelajaran-data-mapel",
            component: () => import("@/views/sekolah/mata-pelajaran/data-mapel/Index.vue")
          },
          {
            path: "jadwal-pelajaran",
            name: "sekolah-mata-pelajaran-jadwal-pelajaran",
            component: () => import("@/views/sekolah/mata-pelajaran/jadwal-pelajaran/Index.vue")
          },
        ],
      },
      {
        path: "sekolah/mata-pelajaran/jadwal-pelajaran/import",
        name: "sekolah-mata-pelajaran-jadwal-pelajaran-import",
        component: () => import("@/views/sekolah/mata-pelajaran/jadwal-pelajaran/Import.vue")
      },
      
      {
        path: "/sekolah/informasi/pengumuman",
        name: "sekolah-informasi-pengumuman",
        component: () => import("@/views/sekolah/informasi/pengumuman/Index.vue"),
      },
      {
        path: "/sekolah/informasi/pengumuman/tambah",
        name: "sekolah-informasi-pengumuman-tambah",
        component: () => import("@/views/sekolah/informasi/pengumuman/Tambah.vue"),
      },
      {
        path: "/sekolah/informasi/pengumuman/edit/:id",
        name: "sekolah-informasi-pengumuman-edit",
        component: () => import("@/views/sekolah/informasi/pengumuman/Edit.vue"),
      },
      {
        path: "/sekolah/informasi/prestasi",
        name: "sekolah-informasi-prestasi",
        component: () => import("@/views/sekolah/informasi/prestasi/Index.vue"),
      },
      {
        path: "/sekolah/informasi/prestasi/tambah",
        name: "sekolah-informasi-prestasi-tambah",
        component: () => import("@/views/sekolah/informasi/prestasi/Tambah.vue"),
      },
      {
        path: "/sekolah/informasi/prestasi/edit/:id",
        name: "sekolah-informasi-prestasi-edit",
        component: () => import("@/views/sekolah/informasi/prestasi/Edit.vue"),
      },
      {
        path: "/sekolah/informasi/event",
        name: "sekolah-informasi-event",
        component: () => import("@/views/sekolah/informasi/event/Index.vue"),
      },
      {
        path: "/sekolah/informasi/event/tambah",
        name: "sekolah-informasi-event-tambah",
        component: () => import("@/views/sekolah/informasi/event/Tambah.vue"),
      },
      {
        path: "/sekolah/informasi/event/edit/:id",
        name: "sekolah-informasi-event-edit",
        component: () => import("@/views/sekolah/informasi/event/Edit.vue"),
      },
      {
        path: "/sekolah/informasi/berita",
        name: "sekolah-informasi-berita",
        component: () => import("@/views/sekolah/informasi/berita/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/sekolah/informasi/berita/utama",
          },
          {
            path: "utama",
            name: "sekolah-informasi-berita-utama",
            component: () =>
              import("@/views/sekolah/informasi/berita/tabs/Utama.vue"),
          },
          {
            path: "kategori",
            name: "sekolah-informasi-berita-kategori",
            component: () =>
              import("@/views/sekolah/informasi/berita/tabs/Kategori.vue"),
          },
        ],
      },
      {
        path: "/sekolah/informasi/berita/tambah",
        name: "sekolah-informasi-berita-tambah",
        component: () => import("@/views/sekolah/informasi/berita/Tambah.vue"),
      },
      {
        path: "/sekolah/informasi/berita/edit/:id",
        name: "sekolah-informasi-berita-edit",
        component: () => import("@/views/sekolah/informasi/berita/Edit.vue"),
      },
      {
        path: "/sekolah/e-document",
        name: "sekolah-e-document",
        component: () => import("@/views/sekolah/e-document/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/sekolah/e-document/rapor",
          },
          {
            path: "rapor",
            name: "sekolah-e-document-rapor",
            component: () =>
              import("@/views/sekolah/e-document/tabs/Rapor.vue"),
          },
          {
            path: "dokumen",
            name: "sekolah-e-document-dokumen",
            component: () =>
              import("@/views/sekolah/e-document/tabs/Dokumen.vue"),
          },
          {
            path: "kategori",
            name: "sekolah-e-document-kategori",
            component: () =>
              import("@/views/sekolah/e-document/tabs/Kategori.vue"),
          },
        ],
      },
      {
        path: "/sekolah/e-document/tambah",
        name: "sekolah-e-document-tambah",
        component: () => import("@/views/sekolah/e-document/Tambah.vue"),
      },
      {
        path: "/sekolah/e-document/detail/:id/:name",
        name: "sekolah-e-document-detail",
        component: () => import("@/views/sekolah/e-document/Detail.vue"),
      },
      {
        path: "/sekolah/laporan/user-online",
        name: "sekolah-laporan-user-online",
        component: () => import("@/views/sekolah/laporan/user-online/Index.vue"),
      },

      {
        path: "/sekolah/akreditasi",
        name: "sekolah-informasi-akreditasi",
        component: () => import("@/views/sekolah/akreditasi/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/sekolah/akreditasi/akreditasi",
          },
          {
            path: "akreditasi",
            name: "sekolah-akreditasi-akreditasi",
            component: () =>
              import("@/views/sekolah/akreditasi/tabs/Akreditasi.vue"),
          },
          {
            path: "website",
            name: "sekolah-akreditasi-website",
            component: () =>
              import("@/views/sekolah/akreditasi/tabs/Website.vue"),
          },
          {
            path: "unduh-pdf",
            name: "sekolah-akreditasi-unduh-pdf",
            component: () =>
              import("@/views/sekolah/akreditasi/tabs/UnduhPdf.vue"),
          },
          {
            path: "video",
            name: "sekolah-akreditasi-video",
            component: () =>
              import("@/views/sekolah/akreditasi/tabs/Video.vue"),
          },
        ],
      },
      {
        path: "/sekolah/media",
        name: "sekolah-media",
        component: () => import("@/views/sekolah/media/Index.vue"),
      },
      {
        path: "/sekolah/media/album/:id",
        name: "sekolah-media-album",
        component: () => import("@/views/sekolah/media/Album.vue"),
      },

      //Iuran
      {
        path: "/iuran/jenis-iuran",
        name: "iuran-jenis-iuran",
        component: () => import("@/views/iuran/jenis-iuran/Index.vue"),
      },
      {
        path: "/iuran/grup-iuran",
        name: "iuran-grup-iuran",
        component: () => import("@/views/iuran/grup-iuran/Index.vue"),
      },
      {
        path: "/iuran/master-iuran",
        name: "iuran-master-iuran",
        component: () => import("@/views/iuran/master-iuran/Index.vue"),
      },
      {
        path: "/iuran/master-iuran/tambah",
        name: "iuran-master-iuran-tambah",
        component: () => import("@/views/iuran/master-iuran/Tambah.vue"),
      },
      {
        path: "/iuran/master-iuran/penetapan/:id/:group",
        name: "iuran-master-iuran-penetapan",
        component: () => import("@/views/iuran/master-iuran/Penetapan.vue"),
      },
      {
        path: "/iuran/iuran-siswa",
        name: "iuran-iuran-siswa",
        component: () => import("@/views/iuran/iuran-siswa/Index.vue"),
      },
      {
        path: "/iuran/iuran-siswa/konfirmasi/:id",
        name: "iuran-iuran-siswa-konfirmasi",
        component: () => import("@/views/iuran/iuran-siswa/Konfirmasi.vue"),
      },

      // Absensi
      {
        path: "/absensi/skema-absensi",
        name: "absensi-skema-absensi",
        component: () => import("@/views/absensi/skema-absensi/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/absensi/skema-absensi/siswa",
          },
          {
            path: "siswa",
            name: "absensi-skema-absensi-siswa",
            component: () =>
              import("@/views/absensi/skema-absensi/siswa/Index.vue"),
          },
          {
            path: "guru",
            name: "absensi-skema-absensi-guru",
            component: () =>
              import("@/views/absensi/skema-absensi/guru/Index.vue"),
          },
        ],
      },
      {
        path: "/absensi/rekapitulasi",
        name: "absensi-rekapitulasi",
        component: () => import("@/views/absensi/rekapitulasi/Index.vue"),
        children: [
          {
            path: "",
            redirect: "/absensi/rekapitulasi/siswa",
          },
          {
            path: "siswa",
            name: "absensi-rekapitulasi-siswa",
            component: () =>
              import("@/views/absensi/rekapitulasi/siswa/Index.vue"),
          },
          {
            path: "guru",
            name: "absensi-rekapitulasi-guru",
            component: () =>
              import("@/views/absensi/rekapitulasi/guru/Index.vue"),
          },
          {
            path: "mapel",
            name: "absensi-rekapitulasi-mapel",
            component: () =>
              import("@/views/absensi/rekapitulasi/mapel/Index.vue"),
          },
        ],
      },
      {
        path: "/absensi/rekapitulasi/siswa/detail/:id/:start/:end",
        name: "absensi-rekapitulasi-siswa-detail",
        component: () =>
          import("@/views/absensi/rekapitulasi/siswa/Detail.vue"),
      },
      {
        path: "/absensi/rekapitulasi/siswa/export",
        name: "absensi-rekapitulasi-siswa-export",
        component: () => import("@/views/absensi/rekapitulasi/siswa/Export.vue"),
      },
      {
        path: "/absensi/rekapitulasi/guru/detail/:id/:start/:end",
        name: "absensi-rekapitulasi-guru-detail",
        component: () =>
          import("@/views/absensi/rekapitulasi/guru/Detail.vue"),
      },
      {
        path: "/absensi/rekapitulasi/guru/export",
        name: "absensi-rekapitulasi-guru-export",
        component: () => import("@/views/absensi/rekapitulasi/guru/Export.vue"),
      },
      {
        path: "/absensi/rekapitulasi/mapel/detail/:id",
        name: "absensi-rekapitulasi-mapel-detail",
        component: () =>
          import("@/views/absensi/rekapitulasi/mapel/Detail.vue"),
      },

      {
        path: "/absensi/absensi-manual",
        name: "absensi-absensi-manual",
        component: () => import("@/views/absensi/absensi-manual/Index.vue"),
      },
      {
        path: "/absensi/waktu-absensi",
        name: "absensi-waktu-absensi",
        component: () => import("@/views/absensi/waktu-absensi/Index.vue"),
      },
      {
        path: "/pengaturan/umum",
        name: "pengaturan-umum",
        component: () => import("@/views/pengaturan/umum/Index.vue"),
      },
      {
        path: "/pengaturan/pengguna",
        name: "pengaturan-pengguna",
        component: () => import("@/views/pengaturan/pengguna/Index.vue"),
      },
      {
        path: "/prototype/api-testing",
        name: "prototype-api-testing",
        component: () => import("@/views/prototype/ApiTesting.vue"),
      },
      {
        path: "/account/profile",
        name: "account-profile",
        component: () => import("@/views/account/profile/Index.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/components/page-layouts/Auth.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
      },
    ],
  },
  {
    // the 404 route, when none of the above matches
    path: "/404",
    name: "404",
    component: () => import("@/views/crafted/authentication/Error404.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((from, to) => {
  // reset config to initial state
  store.commit(Mutations.RESET_LAYOUT_CONFIG);

  // store.dispatch(Actions.VERIFY_AUTH, { api_token: JwtService.getToken() });
  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

export default router;
