<script setup>
import InlineEditor from '@/components/ckeditor-inline/Index.vue'
import { ref } from 'vue'
import QuestionWrapper from './QuestionWrapper.vue'
import useQuestionsData from '../composables/useQuestionsData.js'

const props = defineProps({
	orderNumber: Number,
	wrapperIndex: [Number, String],
	questionIndex: [Number, String],
	question: { type: Object, default: () => ({}) },
})

const { isChanged, cacheQuestionsData } = useQuestionsData()

const isShowEditor = ref([])

function showEditor (optionIndex) {
	if (!isShowEditor.value.includes(optionIndex)) {
		isShowEditor.value.push(optionIndex)
	}
}

function handleOption (selectedIndex) {
	for (const optionIndex in props.question.options) {
		props.question.options[optionIndex].is_correct = optionIndex == selectedIndex
	}
	isChanged.value = true
	// cacheQuestionsData(true)
}
</script>

<template>
	<QuestionWrapper v-bind="{ orderNumber, wrapperIndex, questionIndex, question }">
		<div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="row">
			<div class="col-9 d-flex gap-4">
				<div class="py-5 px-7 fs-5 fw-bolder text-black-50 rounded-2 bg-white">
					{{ String.fromCharCode(optionIndex + 65) }}
				</div>
				<div
					v-if="!isShowEditor.includes(optionIndex)"
					class="option-editor form-control"
					v-html="option.option_text"
					@click="showEditor(optionIndex)">
				</div>
				<InlineEditor
					v-else
					v-model="option.option_text"
					class="option-editor flex-grow-1"
					@input="isChanged = true">
					<!-- @blur="$event.type === 'blur' && cacheQuestionsData()" -->
				</InlineEditor>
			</div>

			<div class="col-3 d-flex align-items-center">
				<div class="form-check">
					<input
						class="form-check-input"
						type="radio"
						:id="'option' + orderNumber + optionIndex"
						:checked="option.is_correct"
						@change="handleOption(optionIndex)">
					<label
						class="form-check-label fs-5 ms-2"
						:for="'option'+ orderNumber + optionIndex">
						Benar
					</label>
				</div>
			</div>
		</div>
	</QuestionWrapper>
</template>