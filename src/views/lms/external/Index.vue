<script setup>
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { onMounted } from "@vue/runtime-core";

onMounted(() => {
  setCurrentPageBreadcrumbs('Sumber Belajar', ['LMS'])
})
</script>

<template>
  <!--begin::Dashboard-->
  <div class="row gy-5 g-xl-8">
    <div class="col-lg-4">    
      <!--begin::List Widget 3-->
      <div class="card" :class="widgetClasses">
        <!--begin::Header-->
        <div class="card-header d-block border-0 pt-5">
          <h3 class="card-title fw-bolder text-dark">Buku Sekolah Elektronik</h3>
          <p class="text-muted mt-1 fw-bold fs-7">bse.belajar.kemdikbud.go.id</p>
        </div>
        <div class="px-4">
          <div class="w-100 rounded-3" style="height: 200px; background-size: cover; background-image: url('https://bse.belajar.kemdikbud.go.id/images/banner2.jpg')">

          </div>
        </div>
        <div class="my-4 text-center m-auto" style="width:80%">
          <span class="text-black-50 mt-1 fw-bold fs-6 ">Buku pembelajaran digital untuk semua jenjang pendidikan SD, SMP, SMA dan SMK</span>
        </div>
        <div class="text-center mb-7">
          <router-link to="/lms/external/buku-sekolah-elektronik" class="btn btn-primary rounded-3" style="width: 80%" >
            <span>
              Selengkapnya
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-lg-4">    
      <!--begin::List Widget 3-->
      <div class="card" :class="widgetClasses">
        <!--begin::Header-->
        <div class="card-header d-block border-0 pt-5">
          <h3 class="card-title fw-bolder text-dark">Sumber Belajar</h3>
          <p class="text-muted mt-1 fw-bold fs-7">sumber.belajar.kemdikbud.go.id</p>
        </div>
        <div class="px-4">
          <div class="w-100 rounded-3" style="height: 200px; background-size: cover; background-image: url('https://bse.belajar.kemdikbud.go.id/images/banner2.jpg')">

          </div>
        </div>
        <div class="my-4 text-center m-auto" style="width:80%">
          <span class="text-black-50 mt-1 fw-bold fs-6 ">Sumber media pembelajaran dalam bentuk bahan belajar digital untuk semua jenjang</span>
        </div>
        <div class="text-center mb-7">
          <router-link to="/lms/external/sumber-belajar" class="btn btn-primary rounded-3" style="width: 80%" >
            <span>
              Selengkapnya
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-lg-4">    
      <!--begin::List Widget 3-->
      <div class="card" :class="widgetClasses">
        <!--begin::Header-->
        <div class="card-header d-block border-0 pt-5">
          <h3 class="card-title fw-bolder text-dark">Bank Soal Rumah Belajar</h3>
          <p class="text-muted mt-1 fw-bold fs-7">banksoal.belajar.kemdikbud.go.id</p>
        </div>
        <div class="px-4">
          <div class="w-100 rounded-3" style="height: 200px; background-size: cover; background-image: url('https://bse.belajar.kemdikbud.go.id/images/banner2.jpg')">

          </div>
        </div>
        <div class="my-4 text-center m-auto" style="width:80%">
          <span class="text-black-50 mt-1 fw-bold fs-6 ">Akses berbagai soal latihan, ulangan dan ujian untuk semua jenjang sekolah</span>
        </div>
        <div class="text-center mb-7">
          <router-link to="/lms/external/bank-soal-rumah-belajar" class="btn btn-primary rounded-3" style="width: 80%" >
            <span>
              Selengkapnya
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-lg-4">    
      <!--begin::List Widget 3-->
      <div class="card" :class="widgetClasses">
        <!--begin::Header-->
        <div class="card-header d-block border-0 pt-5">
          <h3 class="card-title fw-bolder text-dark">British Council Learn English</h3>
          <p class="text-muted mt-1 fw-bold fs-7">learnenglish.britishcouncil.org</p>
        </div>
        <div class="px-4">
          <div class="w-100 rounded-3" style="height: 200px; background-size: cover; background-image: url('https://bse.belajar.kemdikbud.go.id/images/banner2.jpg')">

          </div>
        </div>
        <div class="my-4 text-center m-auto" style="width:80%">
          <span class="text-black-50 mt-1 fw-bold fs-6 ">Learn English online and improve your skills through our high-quality courses and resources</span>
        </div>
        <div class="text-center mb-7">
          <router-link to="/lms/external/british-council-learn-english" class="btn btn-primary rounded-3" style="width: 80%" >
            <span>
              Selengkapnya
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-lg-4">    
      <!--begin::List Widget 3-->
      <div class="card" :class="widgetClasses">
        <!--begin::Header-->
        <div class="card-header d-block border-0 pt-5">
          <h3 class="card-title fw-bolder text-dark">LearningX</h3>
          <p class="text-muted mt-1 fw-bold fs-7">learningx.com</p>
        </div>
        <div class="px-4">
          <div class="w-100 rounded-3" style="height: 200px; background-size: cover; background-image: url('https://bse.belajar.kemdikbud.go.id/images/banner2.jpg')">

          </div>
        </div>
        <div class="my-4 text-center m-auto" style="width:80%">
          <span class="text-black-50 mt-1 fw-bold fs-6 ">Teknologi Edukasi dikembangkan oleh LX International memberikan edukasi berbasis online</span>
        </div>
        <div class="text-center mb-7">
          <router-link to="/lms/external/learningx" class="btn btn-primary rounded-3" style="width: 80%" >
            <span>
              Selengkapnya
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-lg-4">    
      <!--begin::List Widget 3-->
      <div class="card" :class="widgetClasses">
        <!--begin::Header-->
        <div class="card-header d-block border-0 pt-5">
          <h3 class="card-title fw-bolder text-dark">Quizizz</h3>
          <p class="text-muted mt-1 fw-bold fs-7">quizizz.com</p>
        </div>
        <div class="px-4">
          <div class="w-100 rounded-3" style="height: 200px; background-size: cover; background-image: url('https://bse.belajar.kemdikbud.go.id/images/banner2.jpg')">

          </div>
        </div>
        <div class="my-4 text-center m-auto" style="width:80%">
          <span class="text-black-50 mt-1 fw-bold fs-6 ">Free fun multiplayer classroom review tool, that allows all your students to practice and learn together</span>
        </div>
        <div class="text-center mb-7">
          <router-link to="/lms/external/quizizz" class="btn btn-primary rounded-3" style="width: 80%" >
            <span>
              Selengkapnya
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>