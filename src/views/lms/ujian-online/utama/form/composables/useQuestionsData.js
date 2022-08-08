import { computed, reactive } from 'vue'
import qs from 'qs'
import { useToast } from 'vue-toast-notification';

import { requestDevel } from '@/util'

const questionTypeLabels = [
	{ key: 'single', title: 'Pilihan Ganda', icon: 'fa-list-ul' },
	{ key: 'multi', title: 'Pilihan Ganda Kompleks', icon: 'fa-tasks' },
	{ key: 'essay', title: 'Esai / Uraian', icon: 'fa-align-left' },
	{ key: 'match', title: 'Pencocokan', icon: 'fa-wave-square' },
]

const questionsData = reactive({
	exam_id: null,
	question_types: []
})

const isNoQuestion = computed(() => questionsData.question_types.length === 0)

const availableTypes = computed(() => questionTypeLabels.filter(
	typeLabel => !questionsData.question_types.some(
		questionWrapper => questionWrapper.question_type === typeLabel.key
	)
))

function handleRequestError(err) {
	useToast().error(
		typeof err === 'string'
			? err
			: err.hasOwnProperty('message')
				? err.message
				: JSON.stringify(err)
	)
}

function loadQuestionsData() {
	requestDevel.post(
		'v2dev/exam/get-soal',
		qs.stringify({ exam_id: 178 })
	).then(res => {
		const { data } = res.data
		const formattedExamData = {
			...data,
			question_types: !data.question_types ? [] : data.question_types.map(type => ({
				...type,
				optionCount: type.question_type !== 'essay' ? type.questions[0].options.length : 0
			}))
		}

		if (res.data.status) Object.assign(questionsData, formattedExamData)
		else throw res.data
	}).catch(handleRequestError)
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
			match_with_option_id: 'option-dummy-id-' + timestamp + matchIndex
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
}

export default function () {
	return {
		questionsData, questionTypeLabels, availableTypes, isNoQuestion,
		loadQuestionsData, addQuestion, removeQuestion, addQuestionType, removeQuestionType
	}
}