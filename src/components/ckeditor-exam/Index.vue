<script setup>
import { ClassicEditor, UpcastWriter } from '@/vendor/ckeditor5/ckeditor';
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

function onEditorReady(editor) {
  /* editor.model.schema.addChildCheck((context, childDefinition) => {
    if (childDefinition.name == 'softBreak' && Array.from(context.getNames()).includes('paragraph')) {
      return false;
    }
  }); */

  editor.plugins.get('ClipboardPipeline').on('inputTransformation', (evt, data) => {
    console.log([ ...data.content._children ])
    const writer = new UpcastWriter(editor.editing.view.document)
    const newContent = []

    data.content._children.forEach((parent, parentIndex) => {
      if (parent.name === 'br') {
        data.content._children.splice(parentIndex, 1, writer.createElement('p', {}))
      } else if (parent._children) {
        parent._children.forEach((children, childrenIndex) => {
          if (children.name === 'br') {
            data.content._children[parentIndex]._children.splice(childrenIndex, 1, writer.createElement('p', {}))
          }
        })
      }
    })

    if (data.content._children[0].name === 'meta') return

    data.content._children.forEach((parent) => {
      if (parent.name === 'p' && parent._children.length > 1) {
        parent._children.forEach(children => {
          if (children._textData) {
            const newParagraph = writer.createElement('p', {}, writer.createText(children._textData))
            newContent.push(newParagraph)
          }
        })
        newContent.push(writer.createElement('p', {}))
      } else {
        newContent.push(parent)
      }
    })

    data.content = writer.createDocumentFragment(newContent)

  });
}
</script>

<template>
  <div id="exam-editor">
    <ckeditor class="w-100" :editor="editor" v-model="editorData" :config="editorConfig" @ready="onEditorReady"></ckeditor>
  </div>
</template>

<style>
#exam-editor .ck-editor__editable {
  min-height: 40vh;
  max-height: 40vh;
  overflow: scroll;
}
</style>