<script setup>
import { ClassicEditor } from '@/vendor/ckeditor5/ckeditor';
import { computed } from '@vue/reactivity';

const props = defineProps({
  editorValue: String,
  config: { type: Object, default: () => ({}) }
})

const emits = defineEmits(['update:editorValue'])

const editor = ClassicEditor

const editorData = computed({
  get: () => props.editorValue ?? '',
  set: (val) => emits('update:editorValue', val)
})

const editorConfig = {
  ...props.config
}
</script>

<template>
  <ckeditor class="w-100" :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
</template>