<script setup>
import { computed, reactive, watch, watchEffect } from "vue"
import { isEmpty } from "validate.js";

import Modal from "@/components/modals/CustomModal.vue"
import ExamEditor from "@/components/ckeditor-exam/Index.vue";
import useQuestionsData from '../composables/useQuestionsData.js'

const correctOperator = '#jwb#'

const { questionsData, addQuestion, isChanged, cacheQuestionsData } = useQuestionsData()

const props = defineProps({
	editorData: { type: Object, default: () => ({})},
})

const emit = defineEmits(['closeModal', 'submit'])

const isShow = computed(() => !isEmpty(props.editorData))

const state = reactive({
	editorContentRows: [],
	editorContent: '',
})

function getMatchIndex(question, optionId) {
	return question.matches.findIndex(match => match.match_with_option_id === optionId)
}

function stripTags (val) {
	return val?.replace(/(<([^>]+)>)/ig, '').replace('/[\n\r]/g', '').trim() ?? ''
}

function evaluateOption (type, val) {
	const strippedVal = stripTags(val)
	const operatorIndex = strippedVal.indexOf(correctOperator)
	let res = '';

	if (operatorIndex < 0) res = strippedVal
	else {
		switch (type) {
			case 'option':
				res = strippedVal.slice(0, operatorIndex).trim();
				break;
			case 'match':
				res = strippedVal.slice(operatorIndex + correctOperator.length, strippedVal.length).trim();
				break;
		}
	}

	return `<p>${res}</p>`
}

function initEditorContent () {
	if (!props.editorData?.questions) {
		return
	} else if (
		props.editorData?.questions.length === 1 &&
		isEmpty(props.editorData?.questions[0].question_text)
	) {
		state.editorContent = ''
		return
	}

	state.editorContent = props.editorData.questions.reduce((questionAcc, question) => {
		let questionText = questionAcc
		questionText += '<p>' + stripTags(question.question_text) + '</p>\n'
		questionText += !question.options ? '' : question.options.reduce((optionAcc, option, index, options) => {
			let optionText = optionAcc
			optionText += '<p>'
			optionText += stripTags(option.option_text)

			if (question.matches?.length && stripTags(option.option_text)?.length) {
				optionText += ` ${correctOperator} `
				optionText += stripTags(question.matches[getMatchIndex(question, option.option_id)].option_match_text)
			} else if (option.is_correct && stripTags(option.option_text)?.length) {
				optionText += ` ${correctOperator}`
			}

			optionText += '</p>\n'
			optionText += index === options.length - 1 ? '<p>&nbsp;</p>\n' : ''
			return optionText
		}, '')
		return questionText
	}, '')
}

function resolveEditorContentRow () {
	const rowSplittedContents = state.editorContent
		.replaceAll('&nbsp;', '')
		.match(/<p>.*?<\/p>/g) || []

	const editorContentRows = []

	for (let i = 0; i < rowSplittedContents.length; i++) {
		if (rowSplittedContents[i] !== "") {
			// regex menghilangkan nomor / pg di depan text
			let string = rowSplittedContents[i]
			string = rowSplittedContents[i].replace(/>\s*([a-zA-Z0-9]+)(\s*)\./g, ">")
			editorContentRows.push(string)
		}
	}

	state.editorContentRows = editorContentRows
}

function formatContentToJson () {
	const optionCount = props.editorData.optionCount || 0
	const editorContentRows = state.editorContentRows
	const resultWrapper = []
	let itemWrapper = {}
	let options = []

	// perulangan terhadap setiap baris dari konten editor
	for (let i = 0; i < editorContentRows.length; i++) {

		// jika bukan baris pertama, maka dilakukan pemeriksaan tambahan
		if (i > 0) {

			// jika sebelumnya baris kosong, maka dianggap sebagai soal
			if (
				["<p></p>", "<p><br></p>"].includes(editorContentRows[i - 1].trim()) &&
				editorContentRows[i].trim().length > 0
			) {
				itemWrapper.question = editorContentRows[i].trim()
			}

			// jika tidak, maka dianggap sebagai jawaban
			else if (editorContentRows[i].trim().length > 0) {
				// jika baris sebelumnya adalah baris kosong dan jumlah jawaban belum cukup,
				// maka tambahkan baris ini sebagai jawaban
				if (
					["<p></p>", "<p><br></p>"].includes(editorContentRows[i - 1].trim()) &&
					options.length <= optionCount &&
					editorContentRows[i].trim().length > 0
				) {
					options.push(editorContentRows[i].trim())
				}

				// jika baris ini bukan baris kosong dan jumlah jawaban belum cukup dan sudah ada soal,
				// maka tambahkan baris ini sebagai jawaban
				else if (
					itemWrapper.question &&
					options.length <= optionCount &&
					!["<p></p>", "<p><br></p>"].includes(editorContentRows[i].trim())
				) {
					options.push(editorContentRows[i].trim())
				}
			}
		}

		// jika baris pertama, maka dianggap sebagai soal
		else {
			itemWrapper.question = editorContentRows[i].trim()
		}

		// jika pertanyaan sudah ada
		// dan jumlah jawaban lebih atau sama dengan maksimal jawaban
		// atau baris selanjutnya merupakan baris kosong
		// maka pasang jawaban yang terkumpul dan reset wrapper
		if (
			itemWrapper.question && (
				options.length >= optionCount || (
					editorContentRows[i + 1] &&
					["<p></p>", "<p><br></p>"].includes(editorContentRows[i + 1].trim())
				) ||
				editorContentRows[i + 1] === undefined
			)
		) {
			itemWrapper.options = options
			resultWrapper.push(itemWrapper)
			options = []
			itemWrapper = {}
		}
	}

	return resultWrapper
}

function handleSubmit () {
	const editorResult = formatContentToJson()
	const timestamp = Date.now()
	const { optionCount, question_type, keterangan } = props.editorData
	const wrapperIndex = questionsData.question_types.findIndex(type => type.question_type === question_type)

	const questions = editorResult.map((result, questionIndex) => ({
		question_id: 'question-dummy-id-' + timestamp + questionIndex,
		question_text: result.question,
		ehq_order: null,
		keterangan,
		score: 10,
		attachment_id: null,
		attachment_title: null,
		options: [...Array(optionCount).keys()].map(optionIndex => ({
			option_id: 'option-dummy-id-' + timestamp + optionIndex,
			option_text: evaluateOption('option', result.options[optionIndex]),
			is_correct: result.options[optionIndex]?.indexOf(correctOperator) > -1
		})),
		matches: question_type !== 'match' ? [] : [...Array(optionCount).keys()].map(optionIndex => ({
			option_match_text: evaluateOption('match', result.options[optionIndex]),
			match_with_option_id: 'option-dummy-id-' + timestamp + optionIndex,
		}))
	}))

	questionsData.question_types[wrapperIndex].questions = questions
	isChanged.value = true

	if (editorResult.length === 0) addQuestion(wrapperIndex, 0)
	// else cacheQuestionsData(true)

	emit('closeModal')
}

watchEffect(resolveEditorContentRow)

watch(
	isShow,
	(val) => val && initEditorContent(),
	{ immediate: true }
)
</script>

<template>
	<Modal
		title="Editor Soal"
		:show="isShow"
		@confirm="handleSubmit"
		@dismiss="emit('closeModal')">
		<div>
			<!-- <div>{{ JSON.stringify(state.editorContentRows) }}</div>
			<div>{{ JSON.stringify(state.editorContent) }}</div> -->
			<ExamEditor v-model:editorValue="state.editorContent" />
		</div>
	</Modal>
</template>