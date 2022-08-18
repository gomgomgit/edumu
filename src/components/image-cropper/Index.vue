<script setup>
import { computed } from '@vue/reactivity';
import { onActivated, onBeforeMount, onBeforeUpdate, onMounted, ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  fileInputData: Array,
  oldImage: String,
  ratio: {String, required: false},
  cropRequire: {Boolean, default: false},
})

const emits = defineEmits('update:fileInputData')

const image = ref('')
const cropperCanvas = ref()

const imageUrl = ref('')

const imageSrc = ref('')
const imageResult = computed({
  get: () => props.oldImage && props.fileInputData && !imageSrc.value ? props.oldImage : imageSrc.value,
  set: (val) => imageSrc.value = val
})
function onImageChange(payload) {
  const file = payload.target.files[0];
  if(file) {
    if (props.cropRequire) {
      imageUrl.value = URL.createObjectURL(file)
    } else {
      image.value = file

      // imageUrl.value = URL.createObjectURL(file)
      imageResult.value = URL.createObjectURL(file)
      emits('update:fileInputData', payload.target.files[0])
    }
    
  } else {
    image.value = null
    imageUrl.value = null
  }
}

function inputFileClick() {
  document.getElementById('file-input-crop').click()
}
async function cropImage () {
  const { coordinates, canvas } = cropperCanvas.value.getResult();

  imageResult.value = canvas.toDataURL()

  const blob = dataURLtoBlob(imageResult.value)
  emits('update:fileInputData', blob)
  imageUrl.value = null
}
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
function deleteImage() {
  emits('update:fileInputData', null)
  imageUrl.value = null
  imageResult.value = null
}
function openCrop() {
  imageUrl.value = imageResult.value
}
function cancelCrop() {
  imageUrl.value = null
}
</script>

<template>
  <div class="w-100">
    <div class="d-flex w-100 mb-4" v-if="imageResult">
      <div class="d-ib bg-secondary p-4">
        <img class="mw-100" :src="imageResult" alt="" style="max-height: 400px;">
      </div>
    </div>
    <div class="d-flex gap-2">
      <input class="d-none" id="file-input-crop" type="file" accept="image/*" @change="onImageChange">
      <button class="text-white btn btn-bg-primary" @click="inputFileClick">Pilih Gambar</button>
      <button v-if="fileInputData" class="text-white btn btn-bg-success" @click="openCrop()">Potong Gambar</button>
      <button v-if="fileInputData" @click="deleteImage()" class="text-white btn btn-bg-danger">Hapus</button>
      <!-- <button class="text-white btn btn-bg-success" @click="cropImage()">Potong</button> -->
    </div>

    <!-- Modal -->
    <div class="modal-wrapper">
      <transition name="fade">
        <div @click="cancelCrop()" v-if="imageUrl" class="modal-overlay"></div>
      </transition>

      <transition name="slide-fade">
        <div v-if="imageUrl" class="modal-container">
          <div class="modal-header d-block border-bottom border-secondary">
            <div class="fw-bold fs-1 m-4">
              <span>Potong Gambar</span>
            </div>
            <div class="fw-bold fs-4 m-4">
            </div>
          </div>
          <div class="modal-body py-4">
            <cropper
              ref="cropperCanvas"
              class="cropper"
              :src="imageUrl"
              :stencil-props="{
                aspectRatio: props.ratio
              }"
            />
            <div class="modal-body-separator"></div>
          </div>
          <div class="modal-footer border-top border-secondary">
            <div class="d-flex justify-content-end gap-4">
              <button @click="cancelCrop()" class="btn btn-light">Batal</button>
              <button @click="cropImage()" class="btn btn-primary text-white">Simpan</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
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
    z-index: 100;
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
    width: 650px;
    max-width: 90%;
    height: fit-content;
    border-radius: 1rem;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    background: #FFF;
    z-index: 999;
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
  .cropper {
    max-height: 350px;
  }
</style>