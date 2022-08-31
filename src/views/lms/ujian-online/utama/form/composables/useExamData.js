import { reactive, ref } from 'vue'
import { validate } from 'validate.js'
import { useToast } from 'vue-toast-notification'
import qs from 'qs'

import { request } from '@/util'
import store from '@/store'

const initialData = {
	exam_id: null,
	exam_cat_id: null,
	mapel_id: null,
	user_id: null,
	exam_title: null,
	exam_desc: null,
	exam_type: null,
	exam_start_date: null,
	exam_end_date: null,
	exam_time_limit: 60,
	kelas: [],
	showNilai: false,
	showResult: false,
	exam_random: false,
	exam_status: 2,
	soal: 0
}

const isLoading = ref(false)
const isSaving = ref(false)
const isChanged = ref(false)

const rawExamData = reactive({})
const examData = reactive({ ...initialData })

function resetExamData(customData = {}) {
	Object.assign(rawExamData, { ...customData })
	Object.assign(examData, {
		...initialData,
		...customData,
	})
}

async function loadExamData (examId, forceLoad = false) {
	if (examData.exam_id && !forceLoad) return
	try {
		isLoading.value = true
		const res = await request.post(`ujian/${examId}?exam_id=${examId}`)
		const { data, part } = res.data
		const formattedData = {
			exam_id: data.exam_id,
			parent_id: data.parent_id,
			exam_cat_id: data.exam_cat_id,
			mapel_id: data.mapel_id,
			user_id: data.user_id,
			exam_title: data.exam_title,
			exam_desc: data.exam_desc,
			exam_type: data.exam_type,
			exam_start_date: data.exam_start_date.replace(' ', 'T').slice(0, data.exam_start_date.length - 3),
			exam_end_date: data.exam_end_date.replace(' ', 'T').slice(0, data.exam_end_date.length - 3),
			exam_time_limit: data.exam_time_limit,
			kelas: part.map(val => val.kelas_id),
			showNilai: parseInt(data.exam_show_score) ? true : false,
			showResult: parseInt(data.exam_show_result) ? true : false,
			exam_random: parseInt(data.exam_random) ? true : false,
			exam_status: parseInt(data.exam_status) ? true : false,
		}

		Object.assign(examData, formattedData)
		Object.assign(rawExamData, { ...data, kelas: part })
		return formattedData
	} finally {
		isLoading.value = false
	}
}

async function saveExamData (examId, options = {}) {
	try {
		isSaving.value = true
		const rules = {
			exam_title: { presence: { message: 'Judul ujian tidak boleh kosong!' } },
			exam_cat_id: { presence: { message: 'Kategori tidak boleh kosong!' } },
			user_id: { presence: { message: 'Guru tidak boleh kosong!' } },
			mapel_id: { presence: { message: 'Mata pelajaran tidak boleh kosong!' } },
			exam_desc: { presence: { message: 'Keterangan tidak boleh kosong!' } },
			exam_type: { presence: { message: 'Skema waktu ujian tidak boleh kosong!' } },
			exam_start_date: { presence: { message: 'Waktu mulai ujian tidak boleh kosong!' } },
			exam_end_date: { presence: { message: 'Waktu selesai ujian tidak boleh kosong!' } },
			exam_time_limit: { presence: { message: 'Waktu pengerjaan ujian tidak boleh kosong!' } },
			kelas: { presence: { message: 'Kelas peserta tidak boleh kosong!' } },
		}

		const errors = validate(examData, rules, {
			fullMessages: false,
			format: 'flat'
		})

		if (errors) {
			useToast().warning(errors[0])
			throw errors[0]
		} else if (!isChanged.value && !options.immediate && !options.isCreateRemed) {
			return examData
		}

		const payload = {
			...examData,
			kelas: examData.kelas.map(kelasId => ({ kelas_id: kelasId })),
			showNilai: examData.showNilai ? 1 : 0,
			showResult: examData.showResult ? 1 : 0,
			exam_random: examData.exam_random ? 1 : 0,
			exam_status: examData.exam_status ? 1 : 0,
			exam_start_date: examData.exam_start_date.replace('T', ' ') + ':00',
			exam_end_date: examData.exam_end_date.replace('T', ' ') + ':00',
			user_login: store.getters.currentUser?.user_id
		}

		if (options.isCreateRemed) {
			payload.parentId = examId
		}

		const targetUrl = examId ? (options.isCreateRemed ? 'v2dev/exam/remed' : 'exam/update') : 'exam/create'
		const res = await request.post(targetUrl, qs.stringify(payload))

		const { exam } = res.data.data

		if (options.isCreateRemed) {
			await loadExamData(exam.exam_id, true)
		}

		return exam
	} finally {
		isSaving.value = false
		isChanged.value = false
	}
}

export default function () {
	return { examData, rawExamData, isLoading, isSaving, isChanged, loadExamData, saveExamData, resetExamData }
}