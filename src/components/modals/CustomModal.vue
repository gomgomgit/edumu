<script setup>
  const props = defineProps({
    show: {type:  [String, Boolean]},
    title: {type: String},
    confirmText: { type: String, required: false },
    breadcrumb: {type: Array, required: false},
    width: {type:String, required:false},
    dismissable: {type:Boolean, default: true}
  })

  const emits = defineEmits(['closeModal', 'confirm', 'dismiss'])
</script>

<template>
  <div class="modal-wrapper">
    <transition name="fade">
      <div v-if="props.show" class="modal-overlay"></div>
    </transition>

    <transition name="slide-fade">
      <div v-if="props.show" class="modal-container" :style="`width: ${props.width ?? '650px'}`">
        <div class="modal-header d-block border-bottom border-secondary">
          <div class="fw-bold fs-1 m-4 d-flex justify-content-between">
            <div>
              <span>{{props.title}}</span>
            </div>
            <div @click="emits('closeModal')" class="btn btn-icon btn-sm btn-active-light-danger ms-2">
              <span class="svg-icon svg-icon-2x">
                <i class="bi bi-x fs-1"></i>
              </span>
            </div>
          </div>
          <div class="fw-bold fs-4 m-4">
            <template v-if="props.breadcrumb" v-for="bc, index in props.breadcrumb" :key="index">
              <span v-if="index == props.breadcrumb.length - 1">{{bc}}</span>
              <span v-else class="text-black-50">
                <span>{{bc}} / </span>
              </span>
            </template>
          </div>
        </div>
        <div class="modal-body py-4">
          <slot />
          <div class="modal-body-separator"></div>
        </div>
        <div class="modal-footer border-top border-secondary">
          <div class="modal-footer-fade"></div>
          <div class="d-flex justify-content-end gap-4">
            <button v-if="dismissable" @click="emits('dismiss')" class="btn btn-light">Batal</button>
            <button @click="emits('confirm')" class="btn btn-primary text-white">{{ props.confirmText ?? 'Simpan' }}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>

  .modal-overlay {
    content: '';
    position: absolute;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 98;
    background: #000000;
    opacity: 0.4;
    cursor: pointer;
  }
  .modal-container {
    position: absolute;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    max-width: 90%;
    height: fit-content;
    border-radius: 1rem;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    background: #FFF;
    z-index: 99;
    transform: none;
  }
  .modal-body {
    max-height: 60vh;
    overflow-x: auto;
  }
  .modal-body-separator {
    height: 30px;
  }
  .modal-footer {
    position: relative;
  }
  .modal-footer-fade {
    background: linear-gradient(rgba(255, 255, 255, .2), #fff) 100% 0;
    height: 20px;
    position: absolute;
    left: 0;
    right: 0;
    top: -34px;
  }
  .modal-footer-fade::after {
    content: '';
    position: absolute;
    height: 10px;
    width: 100%;
    background: white;
    left: 0;
    right: 0;
    bottom: -10px;
  }

  .slide-fade-enter-active {
    transition: all 0.2s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(40px);
    opacity: 0;
  }

  .fade-leave-to, .fade-enter-from {
    transition: opacity .3s ease-in;
    opacity: 0;
  }
  .fade-leave-enter, .fade-enter-to {
    transition: opacity .3s ease-out;
    opacity: 0.4;
  }
</style>