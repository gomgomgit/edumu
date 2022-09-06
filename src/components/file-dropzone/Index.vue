<script setup>
import { ref } from "vue";

const props = defineProps({
  fileInputData: Array,
  multiple: {Boolean, default: false},
  customUpload: {Boolean, default: false}
})
const emits = defineEmits('update:fileInputData', 'customUpload')

const active = ref(false);
const dropzoneFile = ref("");

function toggleActive () {
  active.value = !active.value;
};
function drop(e) {
  if (props.customUpload) {
    if (props.multiple) {
      emits('customUpload', e.dataTransfer.files)
    } else {
      emits('customUpload', e.dataTransfer.files[0])
    }
  } else {
    if (props.multiple) {
      dropzoneFile.value = e.dataTransfer.files;
      emits('update:fileInputData', e.dataTransfer.files)
    } else {
      dropzoneFile.value = e.dataTransfer.files[0];
      emits('update:fileInputData', e.dataTransfer.files[0])
    }
  }
};
function selectedFile() {
  if (props.customUpload) {
    if (props.multiple) {
      emits('customUpload', document.querySelector(".dropzoneFile").files)
    } else {
      emits('customUpload', document.querySelector(".dropzoneFile").files[0])
    }
  } else {
    if (props.multiple) {
      dropzoneFile.value = null
      dropzoneFile.value = document.querySelector(".dropzoneFile").files;
      emits('update:fileInputData', document.querySelector(".dropzoneFile").files)
    } else {
      dropzoneFile.value = null
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0];
      emits('update:fileInputData', document.querySelector(".dropzoneFile").files[0])
    }
  }
};

function deleteFile() {
    if (props.multiple) {
      dropzoneFile.value = ""
      emits('update:fileInputData', "")
    } else {
      dropzoneFile.value = ""
      emits('update:fileInputData', "")
    }
}
</script>

<template>
<div @drop.prevent="drop">
  <div>
    <div
      @dragenter.prevent="toggleActive"
      @dragleave.prevent="toggleActive"
      @dragover.prevent
      @drop.prevent="toggleActive"
      :class="{ 'active-dropzone': active }"
      class="dropzone"
    >
      <i class="fs-3x bi bi-download"></i>
      <span class="fs-4">Drag & Drop file disini</span>
      <span>atau</span>
      <label class="btn btn-light-primary" for="dropzoneFile">Pilih File</label>
      <input @change="selectedFile" type="file" :multiple="props.multiple" id="dropzoneFile" class="dropzoneFile" />
    </div>
  </div>
  <div class="d-flex gap-4">
    <div class="mt-3" v-if="dropzoneFile">
      <button @click="deleteFile()" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
        <span class="svg-icon svg-icon-3">
          <inline-svg src="media/icons/duotune/general/gen027.svg"/>
        </span>
      </button>
    </div>
    <div class="d-flex flex-column gap-2 mt-3">
      <template v-if="multiple" v-for="file, fileIndex in dropzoneFile" :key="fileIndex">
        <p class="m-0 fs-4">
          File: {{ file.name }} - {{file.size}} bytes 
        </p>
      </template>
      <template v-if="!multiple && dropzoneFile">
        <p class="m-0 fs-4">File: {{ dropzoneFile.name }} - {{dropzoneFile.size}} bytes</p>
      </template>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.dropzone {
  width: 100%;
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 12px;
  border: 3px dashed #cecece;
  background-color: #fff;
  transition: 0.3s ease all;
  input {
    display: none;
  }
}
.active-dropzone {
  color: #fff;
  border-color: #fff;
  background-color: #159BEA;
  label {
    background-color: #fff;
    color: #41b883;
  }
}
</style>