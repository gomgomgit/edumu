<script setup>
import { InlineEditor } from '@/vendor/ckeditor5/ckeditor';
import { computed } from '@vue/reactivity';

const props = defineProps({
  editorValue: String,
  config: { type: Object, default: () => ({}) }
})

const emits = defineEmits(['update:editorValue'])

const editor = InlineEditor

const editorData = computed({
  get: () => props.editorValue ?? '',
  set: (val) => emits('update:editorValue', val)
})

const editorConfig = {
  ...props.config
}

function handleOnReady (editor) {
  editor.editing.view.focus()
  editor.model.change(writer => {
    writer.setSelection(writer.createPositionAt(editor.model.document.getRoot(), 'end'));
  });
}
</script>

<template>
  <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="handleOnReady"></ckeditor>
</template>

<style scoped>
.ck-content {
  border: 1px solid #E4E6EF;
  background-color: white;
}
</style>