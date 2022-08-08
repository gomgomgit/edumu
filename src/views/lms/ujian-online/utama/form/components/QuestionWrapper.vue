<script setup>
import InlineEditor from '@/components/ckeditor-inline/Index.vue'
import { ref } from 'vue';
import useQuestionsData from '../composables/useQuestionsData.js'

defineProps({
	orderNumber: Number,
	wrapperIndex: [Number, String],
	questionIndex: [Number, String],
	question: { type: Object, default: () => ({}) },
})

const { addQuestion, removeQuestion } = useQuestionsData()

const isShowEditor = ref(false)
</script>

<template>
	<section class="question-item bg-light rounded-3 p-4 d-flex flex-column gap-4">
		<div class="row">
			<div class="col-9">
				<textarea
					v-if="!isShowEditor"
					class="question-editor form-control test"
					:value="question.question_text.replace(/(<([^>]+)>)/gi, '')"
					@click="isShowEditor = true">
				</textarea>
				<InlineEditor
					v-else
					class="question-editor"
					v-model="question.question_text">
				</InlineEditor>
			</div>
			<div class="col-3 d-flex justify-content-between">
				<div class="question-action">
					<div class="question-remove" role="button" @click="removeQuestion(wrapperIndex, questionIndex)">
						<img src="figma-icon/question-remove.png" alt="" />
					</div>
					<div class="question-add" role="button" @click="addQuestion(wrapperIndex, questionIndex)">
						<img src="figma-icon/question-add.png" alt="" />
					</div>
				</div>
				<div class="py-5 px-7 fs-2 fw-bolder text-black-50 rounded-2 bg-white align-self-start">
					{{ orderNumber }}
				</div>
			</div>
		</div>

		<slot></slot>

	</section>
</template>

<style scoped>
.question-item .question-action {
	width: 2.3rem;
	height: 2.3rem;
	align-self: flex-end;
	position: relative;
	bottom: 6px;
	left: -2px;
	transform: rotate(-45deg);
}

.question-item .question-remove {
	width: 2.4rem;
	height: 1.2rem;
	cursor: pointer;
	overflow: hidden;
	transform-origin: bottom;
	transition: transform ease .25s;
}

.question-item .question-remove img {
	transform: rotate(45deg);
	position: relative;
	top: 2px;
	left: 4px;
}

.question-item .question-add {
	width: 2.4rem;
	height: 1.2rem;
	cursor: pointer;
	overflow: hidden;
	transform-origin: top;
	transition: transform ease .25s;
}

.question-item .question-add img {
	transform: rotate(45deg);
	position: relative;
	bottom: 9px;
	left: 4px;
}

.question-item :where(.question-add, .question-remove):hover {
	transform: scale(1.2);
}
</style>