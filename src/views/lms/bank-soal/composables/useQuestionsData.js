import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toast-notification';
import { isEmpty, result } from 'validate.js';
import qs from 'qs'
// import sanitizeHtml from 'sanitize-html';

import { request, sanitizeHtml } from '@/util'
import { useRouter } from 'vue-router';
import { deleteConfirmation } from '@/core/helpers/deleteconfirmation';

const questionTypeLabels = [
	{ key: 'single', title: 'Pilihan Ganda', icon: 'fa-list-ul' },
	{ key: 'multi', title: 'Pilihan Ganda Kompleks', icon: 'fa-tasks' },
	{ key: 'essay', title: 'Esai / Uraian', icon: 'fa-align-left' },
	{ key: 'match', title: 'Pencocokan', icon: 'fa-wave-square' },
]

const router = useRouter()

const isLoading = ref(false)
const isSaving = ref(false)
const isChanged = ref(false)

const errorBag = ref({})

const initialData = {
	mapel_id: null,
	create_by: null,
	question_types: []
}

const guruOption = ref()
const mapelOption = ref()

const questionsData = reactive({ ...initialData })

const isNoQuestion = computed(() => questionsData.question_types.length === 0)

const availableTypes = computed(() => questionTypeLabels.filter(
	typeLabel => !questionsData.question_types.some(
		questionWrapper => questionWrapper.question_type === typeLabel.key
	)
))


function getData() {
  request.post("user", null, {
    params: {
      level: 'guru'
    }
  }).then(res => {
    guruOption.value = res.data.data
  })
  request.post("mapel")
  .then(res => {
    mapelOption.value = res.data.data
  })
}
function getDetail(id) {
	request.post('/v2dev/soal/detail', qs.stringify({question_id: id}))
	.then(res => {
		var result = res.data.data
		questionsData.mapel_id = result.mapel_id
		questionsData.create_by = result.create_by
		questionsData.question_types = [{
			keterangan: result.keterangan,
			optionCount : result.options.length,
			question_type : result.question_type,
			questions: [{				
				ehq_order : null,
				keterangan : result.keterangan,
				matches: result.matches.map(match => {					
					return {
						is_correct: 1,
						match_with_option_id: match.match_with_option_id, 
						option_match_text: match.option_match_text,
						option_match_id: match.option_match_id,
						question_id: match.question_id,
					}
				}),
				options: result.options.map(option => {					
					return {
						is_correct : option.is_correct,
						option_id : option.option_id,
						option_text : option.option_text,
						question_id : option.question_id,
					}
				}),
				question_id : result.question_id,
				question_text : result.question_text
			}]
		}]
	})
}

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
			keterangan: type.questions?.length ? type.questions[0].keterangan : null,
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

	request.post(
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
		const res = await request.post(
			'/v2dev/exam/cache-soal?',
			params
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
	let errorInput = []
	if (isEmpty(questionsData.create_by)) {
		errorInput.push('Harap Pilih Guru. ')
	}
	if (isEmpty(questionsData.mapel_id)) {
		errorInput.push('Harap Pilih Mapel. ')
	}
	if (isEmpty(questionsData.question_types)) {
		errorInput.push('Harap Isi Soal,')
	}
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
	var errorArray = Object.values(errorBag.value)
	errorArray.unshift(...errorInput)
	return errorArray
	return Object.values(errorBag.value)
}

async function submitQuestionsData (bypassOrderNumber = false) {
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
					ehq_order: bypassOrderNumber ? question.ehq_order : resolveOrderNumber(typeIndex, questionIndex),
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
		const res = await request.post('/v2dev/soal/create-batch?', params)

		if (res.data.status === true) {
			const { data } = res.data
			Object.assign(questionsData, formatQuestionsData(data))

			isSaving.value = false
			isChanged.value = false

			useToast().success('Soal Berhasil ditambahkan')
			return true
		}
		else if (res.data.status === false) {
			throw res.data.text
			return false
		}
	} catch (err) {
		isSaving.value = false
		return false
	}
}
async function editQuestionsData (bypassOrderNumber = false) {
	try {
		isSaving.value = true

		const errors = validateQuestionsData()
		if (errors.length) {
			useToast().warning(errors[0], { duration: 60000 })
			throw false
		}

		const payload = {
			id:410,
			mapel_id: questionsData.mapel_id,
			create_by: questionsData.create_by,
			question_type : questionsData.question_types[0].question_type,
			question_text : questionsData.question_types[0].questions[0].question_text,
			question_id : questionsData.question_types[0].questions[0].question_id,
			keterangan : questionsData.question_types[0].questions[0].keterangan,
			options: questionsData.question_types[0].questions[0].options.map(option => {
				return {
					option_id: option.option_id,
					question_id: option.question_id,
					option_text: option.option_text,
					is_correct: option.is_correct ? 1 : 0,
				}
			}),
			matches: questionsData.question_types[0].questions[0].matches.map(match => {
				return {
					option_match_id: match.option_match_id,
					question_id: match.question_id,
					option_match_text: match.option_match_text,
					match_with_option_id: match.match_with_option_id,
					is_correct: 1,
				}
			}),
			
		}

		const params = qs.stringify(payload)
		const res = await request.post('/v2dev/soal/edit', qs.stringify(payload))

		if (res.data.status === true) {
			isSaving.value = false
			isChanged.value = false
			useToast().success('Soal berhasil diedit!')
			return true
		}
		else if (res.data.status === false) {
			throw res.data.text
			return false
		}
	} catch (err) {
		return false
		// isSaving.value = false
		// if (err !== false) handleRequestError(err)
		// throw err
	}
}

function addQuestion (wrapperIndex, questionIndex) {
	const timestamp = Date.now()
	const { question_type, optionCount, keterangan } = questionsData.question_types[wrapperIndex]
	const newQuestion = {
		question_id: 'question-dummy-id-' + timestamp,
		question_text: '',
		ehq_order: null,
		keterangan,
		score: 10,
		attachment_id: null,
		attachment_title: null,
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
	deleteConfirmation(() => {
		questionsData.question_types[wrapperIndex].questions.splice(questionIndex, 1)
		if (questionsData.question_types[wrapperIndex].questions.length === 0) {
			removeQuestionType(wrapperIndex)
		}
	}, null, 'Anda yakin menghapus soal ini?')
	// if (!window.confirm('Apakah anda yakin?')) return
	// questionsData.question_types[wrapperIndex].questions.splice(questionIndex, 1)
	// if (questionsData.question_types[wrapperIndex].questions.length === 0) {
	// 	removeQuestionType(wrapperIndex)
	// }
	// else {
	// 	cacheQuestionsData(true)
	// }
}

function addQuestionType (payload) {
	questionsData.question_types.push({
		question_type: payload.questionType,
		optionCount: parseInt(payload.optionCount),
		keterangan: payload.keterangan,
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

function resolveScore () {
	const scoresData = []

	for (const wrapperIndex in questionsData.question_types) {
		const wrapper = questionsData.question_types[wrapperIndex]
		for (const questionIndex in wrapper.questions) {
			const question = wrapper.questions[questionIndex]
			scoresData.push({
				wrapperIndex,
				questionIndex,
				score: parseInt(question.score),
				is_score_manual: question.is_score_manual === 'string'
					? parseInt(question.is_score_manual)
					: question.is_score_manual,
			})
		}
	}

	const manualScoreSum = scoresData.filter(data => data.is_score_manual).reduce((acc, curr) => acc + curr.score, 0)
	console.log('manualScoreSum', manualScoreSum)
	const autoScoreSum = scoresData.filter(data => !data.is_score_manual).reduce((acc, curr) => acc + curr.score, 0)
	console.log('autoScoreSum', autoScoreSum)
	const totalScoreSum = manualScoreSum + autoScoreSum
	console.log('totalScoreSum', totalScoreSum)

	const manualScoreCount = scoresData.filter(data => data.is_score_manual).length
	console.log('manualScoreCount', manualScoreCount)
	const autoScoreCount = scoresData.filter(data => !data.is_score_manual).length
	console.log('autoScoreCount', autoScoreCount)
	const totalScoreCount = manualScoreCount + autoScoreCount
	console.log('totalScoreCount', totalScoreCount)

	const autoPercentage = 100 - Math.round(manualScoreSum / totalScoreCount * 100, 2)
	console.log('autoPercentage', autoPercentage)
	const autoScoreTotal = Math.round(totalScoreSum * autoPercentage / 100, 2)
	console.log('autoScoreTotal', autoScoreTotal)
	const autoScorePerQuestion = Math.round(autoScoreTotal / autoScoreCount, 2)
	console.log('autoScorePerQuestion', autoScorePerQuestion)

	const autoScoresData = scoresData.filter(data => !data.is_score_manual)
	console.log('autoScoresData', autoScoresData)

	for (const scoreData of autoScoresData) {
		questionsData
			.question_types[scoreData.wrapperIndex]
			.questions[scoreData.questionIndex]
			.score = autoScorePerQuestion
	}
}

export default function () {
	return {
		guruOption, mapelOption, questionsData, questionTypeLabels, availableTypes, isNoQuestion, isChanged, isLoading, isSaving, errorBag,
		getData, getDetail, addQuestion, removeQuestion, addQuestionType, removeQuestionType, resolveOrderNumber, resolveScore,
		loadQuestionsData, cacheQuestionsData, submitQuestionsData, editQuestionsData, resetQuestionsData
	}
}