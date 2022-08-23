import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toast-notification';
import { isEmpty } from 'validate.js';
import qs from 'qs'
import sanitizeHtml from 'sanitize-html';

import { requestDevel } from '@/util'

const questionTypeLabels = [
	{ key: 'single', title: 'Pilihan Ganda', icon: 'fa-list-ul' },
	{ key: 'multi', title: 'Pilihan Ganda Kompleks', icon: 'fa-tasks' },
	{ key: 'essay', title: 'Esai / Uraian', icon: 'fa-align-left' },
	{ key: 'match', title: 'Pencocokan', icon: 'fa-wave-square' },
]

const isLoading = ref(false)
const isSaving = ref(false)
const isChanged = ref(false)

const errorBag = ref({})

const initialData = {
	exam_id: null,
	question_types: []
}

const questionsData = reactive({ ...initialData })

const isNoQuestion = computed(() => questionsData.question_types.length === 0)

const availableTypes = computed(() => questionTypeLabels.filter(
	typeLabel => !questionsData.question_types.some(
		questionWrapper => questionWrapper.question_type === typeLabel.key
	)
))

function handleRequestError(err) {
	useToast().warning(
		typeof err === 'string'
			? err
			: err.hasOwnProperty('message')
				? err.message
				: JSON.stringify(err)
	)
}

function formatQuestionsData (data) {
	return {
		...data,
		question_types: !data.question_types ? [] : data.question_types.map(type => ({
			...type,
			optionCount: type.question_type !== 'essay' ? type.questions[0].options.length : 0,
			questions: type.questions.map(question => ({
				...question,
				question_text: sanitizeHtml(question.question_text),
				options: !question.options ? [] : question.options.map(option => ({
					...option,
					option_text: sanitizeHtml(option.option_text),
					is_correct: typeof option.is_correct === 'string' ? parseInt(option.is_correct) : option.is_correct
				})),
				matches: !question.matches ? [] : question.matches.map(match => ({
					...match,
					option_match_text: sanitizeHtml(match.option_match_text),
					is_correct: 1
				}))
			}))
		}))
	}
}

function resetQuestionsData () {
	Object.assign(questionsData, {...initialData})
}

function loadQuestionsData(examId) {
	if (questionsData.exam_id !== null || examId == questionsData.exam_id) return

	isLoading.value = true

	requestDevel.post(
		'v2dev/exam/get-cached-soal',
		qs.stringify({ exam_id: examId })
	).then(res => {
		const { data } = res.data
		const formattedQuestionsData = formatQuestionsData(data)

		if (res.data.status) Object.assign(questionsData, formattedQuestionsData)
		else throw res.data
	})
	.catch(handleRequestError)
	.finally(() => isLoading.value = false)
}

async function cacheQuestionsData (immediate) {
	if (!isChanged.value && immediate !== true) return
	try {
		const payload = {
			...questionsData,
			question_types: questionsData.question_types.map(type => ({
				...type,
				questions: type.questions.map(question => ({
					...question,
					options: !question.options ? [] : question.options.map(option => ({
						...option,
						is_correct: option.is_correct ? 1 : 0
					}))
				}))
			}))
		}
		const params = qs.stringify(payload)
		const res = await requestDevel.post(
			'/v2dev/exam/cache-soal?'
			+ params
			+ (params.includes('question_types') ? '' : '&question_types[]')
		)

		if (res.data.status === true) {
			const { data } = res.data
			Object.assign(questionsData, formatQuestionsData(data))

			isChanged.value = false
			useToast().info('Autosaved successfully!')
		}
		else if (res.data.status === false) throw res.data.text
	} catch (err) {
		// handleRequestError(err)
		console.error(err.message)
		console.error(err.response)
	}
}

function validateQuestionsData () {
	for (const typeIndex in questionsData.question_types) {
		const type = questionsData.question_types[typeIndex]
		const typeTitle = questionTypeLabels.find(label => label.key === type.question_type).title

		for (const questionIndex in type.questions) {
			const question = type.questions[questionIndex]
			let errorKey = `${typeIndex}-${questionIndex}`
			let errorMsg = ''

			if (isEmpty(question.question_text)) {
				errorMsg += 'Pertanyaan harus diisi. '
			}
			if (['single', 'multi', 'match'].includes(type.question_type) && question.options?.some(option => isEmpty(option.option_text))) {
				errorMsg += 'Pilihan jawaban harus diisi. '
			}
			if (['single', 'multi'].includes(type.question_type) && question.options?.every(
				option => option.is_correct === 'string' ? !parseInt(option.is_correct) : !option.is_correct
			)) {
				errorMsg += 'Jawaban benar harus diisi. '
			}
			if (['match'].includes(type.question_type)  && question.matches?.some(match => isEmpty(match.option_match_text))) {
				errorMsg += 'Pasangan dari pilihan harus diisi. '
			}

			if (errorMsg.length) {
				const orderNumber = resolveOrderNumber(typeIndex, questionIndex)
				const msgPrefix = `${typeTitle} soal no ${orderNumber} : `
				errorBag.value[errorKey] = msgPrefix + errorMsg
			}
			else if (errorBag.value[errorKey]) {
				delete errorBag.value[errorKey]
			}
		}
	}

	return Object.values(errorBag.value)
}

async function submitQuestionsData () {

	try {
		isSaving.value = true

		const errors = validateQuestionsData()
		if (errors.length) {
			useToast().warning(errors[0], { duration: 60000 })
			throw false
		}

		const payload = {
			...questionsData,
			question_types: questionsData.question_types.map((type, typeIndex) => ({
				...type,
				questions: type.questions.map((question, questionIndex) => ({
					...question,
					ehq_order: resolveOrderNumber(typeIndex, questionIndex),
					keterangan: question?.keterangan ?? null,
					score: question?.score ?? 0,
					attachment_id: question?.attachment_id ?? null,
					options: !question.options ? [] : question.options.map(option => ({
						...option,
						is_correct: option.is_correct ? 1 : 0
					}))
				}))
			}))
		}
		const params = qs.stringify(payload)
		const res = await requestDevel.post('/v2dev/exam/save-soal?', params)

		if (res.data.status === true) {
			const { data } = res.data
			Object.assign(questionsData, formatQuestionsData(data))

			isSaving.value = false
			isChanged.value = false
			useToast().info('Soal ujian berhasil disimpan!')
		}
		else if (res.data.status === false) throw res.data.text
	} catch (err) {
		isSaving.value = false
		if (err !== false) handleRequestError(err)
		throw err
	}
}

function addQuestion (wrapperIndex, questionIndex) {
	const timestamp = Date.now()
	const { question_type, optionCount } = questionsData.question_types[wrapperIndex]
	const newQuestion = {
		question_id: 'question-dummy-id-' + timestamp,
		question_text: '',
		ehq_order: null,
		options: question_type === 'essay' ? [] : [...Array(optionCount).keys()].map((optionIndex) => ({
			option_id: 'option-dummy-id-' + timestamp + optionIndex,
			option_text: '',
			is_correct: 0
		})),
		matches: question_type !== 'match' ? [] : [...Array(optionCount).keys()].map((matchIndex) => ({
			option_match_text: '',
			match_with_option_id: 'option-dummy-id-' + timestamp + matchIndex,
			is_correct: 1
		}))
	}

	questionsData.question_types[wrapperIndex].questions.splice(questionIndex + 1, 0, newQuestion)
}

function removeQuestion (wrapperIndex, questionIndex) {
	if (!window.confirm('Apakah anda yakin?')) return
	questionsData.question_types[wrapperIndex].questions.splice(questionIndex, 1)
	if (questionsData.question_types[wrapperIndex].questions.length === 0) {
		removeQuestionType(wrapperIndex)
	}
	// else {
	// 	cacheQuestionsData(true)
	// }
}

function addQuestionType (payload) {
	questionsData.question_types.push({
		question_type: payload.questionType,
		optionCount: parseInt(payload.optionCount),
		questions: []
	})

	addQuestion(questionsData.question_types.length - 1, 0)
	window.scrollTo(0, document.body.scrollHeight)
}

function removeQuestionType (wrapperIndex) {
	questionsData.question_types.splice(wrapperIndex, 1)
	// cacheQuestionsData(true)
}

function resolveOrderNumber(wrapperIndex, questionIndex) {
	wrapperIndex = parseInt(wrapperIndex)
	questionIndex = parseInt(questionIndex)
	const previousWrapperLastNumber = questionsData.question_types
		.slice(0, wrapperIndex)
		.reduce((acc, curr) => acc + curr.questions.length, 0)

	const previousNumber = wrapperIndex === 0 ? 0 : previousWrapperLastNumber
	const currentNumber = questionIndex + 1

	return previousNumber + currentNumber
}

export default function () {
	return {
		questionsData, questionTypeLabels, availableTypes, isNoQuestion, isChanged, isLoading, isSaving, errorBag,
		addQuestion, removeQuestion, addQuestionType, removeQuestionType, resolveOrderNumber,
		loadQuestionsData, cacheQuestionsData, submitQuestionsData, resetQuestionsData
	}
}