<script setup>
import InlineEditor from '@/components/ckeditor-inline/Index.vue'
import { reactive } from 'vue'
import QuestionWrapper from './QuestionWrapper.vue'
import useQuestionsData from '../composables/useQuestionsData.js'

const props = defineProps({
	orderNumber: Number,
	wrapperIndex: [Number, String],
	questionIndex: [Number, String],
	question: { type: Object, default: () => ({}) },
})

const { isChanged, cacheQuestionsData } = useQuestionsData()

const isShowEditor = reactive({
	options: [],
	matches: [],
})

function showEditor (type, index) {
	if (!isShowEditor[type].includes(index)) {
		isShowEditor[type].push(index)
	}
}

function getMatchIndex (optionId) {
	return props.question.matches.findIndex(match => match.match_with_option_id === optionId)
}
</script>

<template>
	<QuestionWrapper v-bind="{ orderNumber, wrapperIndex, questionIndex, question }">
		<div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="row">
			<div class="col-9 d-flex gap-4">
				<div class="py-5 px-7 fs-5 fw-bolder text-black-50 rounded-2 bg-white">
					{{ String.fromCharCode(optionIndex + 65) }}
				</div>

				<div class="flex-grow-1 d-flex justify-content-between align-items-center h-100">
					<section class="option-section h-100">
						<textarea
							v-if="!isShowEditor.options.includes(optionIndex)"
							class="option-editor form-control"
							:value="option.option_text.replace(/(<([^>]+)>)/gi, '')"
							@click="showEditor('options', optionIndex)">
						</textarea>
						<InlineEditor
							v-else
							v-model="option.option_text"
							class="option-editor"
							@input="isChanged = true"
							@blur="$event.type === 'blur' && cacheQuestionsData()">
						</InlineEditor>
					</section>

					<i class="fas fa-arrow-right"></i>

					<section class="option-section h-100">
						<textarea
							v-if="!isShowEditor.matches.includes(optionIndex)"
							class="option-editor form-control"
							:value="question.matches[getMatchIndex(option.option_id)].option_match_text.replace(/(<([^>]+)>)/gi, '')"
							@click="showEditor('matches', optionIndex)">
						</textarea>
						<InlineEditor
							v-else
							v-model="question.matches[getMatchIndex(option.option_id)].option_match_text"
							class="option-editor"
							@input="isChanged = true"
							@blur="$event.type === 'blur' && cacheQuestionsData()">
						</InlineEditor>
					</section>
				</div>
			</div>
		</div>
	</QuestionWrapper>
</template>

<style scoped>
.option-section {
	width: 47% !important;
}
.option-editor {
	height: 100%;
}
</style>