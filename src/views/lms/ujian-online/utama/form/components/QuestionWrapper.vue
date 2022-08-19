<script setup>
import InlineEditor from '@/components/ckeditor-inline/Index.vue'
import { ref, computed } from 'vue';
import useQuestionsData from '../composables/useQuestionsData.js'

const props = defineProps({
	orderNumber: Number,
	wrapperIndex: [Number, String],
	questionIndex: [Number, String],
	question: { type: Object, default: () => ({}) },
})

const { isChanged, errorBag, cacheQuestionsData } = useQuestionsData()

const isShowEditor = ref(false)

const isError = computed(() => errorBag.value[`${props.wrapperIndex}-${props.questionIndex}`])
</script>

<template>
	<section
		class="question-item rounded-3 p-4 d-flex flex-column gap-4"
		:class="isError ? 'bg-danger bg-opacity-10' : 'bg-light'">
		<div class="row">
			<div class="col-9">
				<div
					v-if="!isShowEditor"
					class="question-editor form-control test"
					v-html="question.question_text"
					@click="isShowEditor = true">
				</div>
				<InlineEditor
					v-else
					class="question-editor"
					v-model="question.question_text"
					@input="isChanged = true">
					<!-- @blur="$event.type === 'blur' && cacheQuestionsData()" -->
				</InlineEditor>
			</div>
			<div class="col-3 d-flex justify-content-between">
				<div></div>
				<div class="py-5 px-7 fs-2 fw-bolder text-black-50 rounded-2 bg-white align-self-start">
					{{ orderNumber }}
				</div>
			</div>
		</div>

		<slot></slot>

	</section>
</template>