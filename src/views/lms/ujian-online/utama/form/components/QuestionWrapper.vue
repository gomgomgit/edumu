<script setup>
import { ref, computed, watch } from 'vue';
import InlineEditor from '@/components/ckeditor-inline/Index.vue'

import useQuestionsData from '../composables/useQuestionsData.js'
import useAttachment from '../composables/useAttachment.js'

const props = defineProps({
	orderNumber: Number,
	wrapperIndex: [Number, String],
	questionIndex: [Number, String],
	question: { type: Object, default: () => ({}) },
})

const { isChanged, errorBag, resolveScore, cacheQuestionsData } = useQuestionsData()
const { setAttachmentData } = useAttachment()

const isShowEditor = ref(false)

const isError = computed(() => errorBag.value[`${props.wrapperIndex}-${props.questionIndex}`])

function removeAttachment () {
	props.question.attachment_id = null
	props.question.attachment_title = null
}

function handleScoreChange () {
	props.question.is_score_manual = 1
	// resolveScore()
}

// watch(
// 	props.question,
// 	console.log
// )
</script>

<template>
	<section
		class="question-item rounded-3 p-4 d-flex flex-column gap-4"
		:class="isError ? 'bg-danger bg-opacity-10' : 'bg-light'">
		<div class="row">
			<div class="col-9 question-text-wrapper">
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

				<el-tag
					v-if="question.attachment_id"
					class="attachment-tag"
					closable
					:disable-transitions="false"
					@close="removeAttachment">
					<i class="uil uil-paperclip"></i>&nbsp; {{ question.attachment_title.substring(0, 20) }}
				</el-tag>
			</div>

			<div class="col-3 d-flex justify-content-between">
				<div class="d-flex flex-column-reverse py-1 gap-6">
					<el-input-number
						v-model="question.score"
						class="score-input"
						@change="handleScoreChange" />

					<el-tooltip
						class="box-item"
						effect="light"
						content="Tambahkan Lampiran"
						placement="top-start">
						<img
							class="attachment-icon"
							role="button"
							src="/figma-icon/attachment.png"
							alt="attachment"
							@click="setAttachmentData(question, wrapperIndex, questionIndex)">
					</el-tooltip>
				</div>
				<div class="py-5 px-7 fs-2 fw-bolder text-white rounded-2 bg-primary align-self-start">
					{{ orderNumber }}
				</div>
			</div>
		</div>

		<slot></slot>

	</section>
</template>

<style scoped>
.score-input {
	width: 140px;
}
.attachment-icon {
	margin-left: 1px;
	width: 30px;
	height: 30px;
	object-fit: contain;
	transition: transform .2s;
	transform-origin: left;
}
.attachment-icon:hover {
	transform: scale(1.2);
}
.question-text-wrapper {
	position: relative;
}
.attachment-tag {
	position: absolute;
	z-index: 1;
	top: 8px;
	right: 18px;
}
</style>
