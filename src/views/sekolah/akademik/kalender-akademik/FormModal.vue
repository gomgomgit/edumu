<script setup>
import { reactive, ref, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";

const props = defineProps({
	mode: { type: String, required: true },
	activeData: { type: Object, required: true },
	kelas: { type: Object, required: true },
})

const emits = defineEmits(['close', 'submit'])

const initialForm = { libur_id: '',  kelas_id: '', libur_desc: '' }

const form = reactive({...initialForm})

const dateRange = ref(['', ''])
const liburTanggal = ref()

function handleClose () {
	Object.assign(form, {...initialForm})
	emits('close')
}

function kelasChange() {
	let selectedClass = ''
	if (form.kelas_id.includes('all')) {
		selectedClass = props.kelas.map(function (obj) {
			return obj.kelas_id
		})
		form.kelas_id = selectedClass
	}
}
function handleSubmit () {
	// let selectedClass = ''
	// if (form.kelas_id.includes('all')) {
	// 	selectedClass = kelas.value.map(function (obj) {
	// 		return obj.kelas_id
	// 	})
	// } else {
	// 	selectedClass = form.kelas_id
	// }
	
	const formData = new FormData()
	formData.append('libur_id', form.libur_id)
	formData.append('kelas_id', form.kelas_id)
	formData.append('libur_desc', form.libur_desc)
	if (props.activeData) {
		formData.append('libur_tanggal', liburTanggal.value)
	} else {
		formData.append('libur_mulai', dateRange.value[0])
		formData.append('libur_selesai', dateRange.value[1])
	}

	const endpoint = isEmpty(props.activeData) ? 'libur/add' : 'libur/edit'
	const message = isEmpty(props.activeData) ? 'Ditambahkan!' : 'Diubah!'

	request.post(endpoint, formData).then(() => {
		Object.assign(form, initialForm)
		useToast().success('Data Berhasil ' + message)
		emits('submit')
		emits('close')
	})
}
function changeDate() {
	form.libur_mulai = dateRange.value[0]
	form.libur_selesai = dateRange.value[1]
}

function disabledDate(date) {
	console.log(date)
	// return date < Date.now()
}

watch(
	() => props.activeData,
	activeData => {
		if (!isEmpty(activeData)) {
			Object.assign(form, { libur_id: activeData.libur_id, libur_desc: activeData.libur_desc })
			console.log(activeData.libur_tanggal)
			liburTanggal.value = activeData.libur_tanggal
		}
	},
	{ deep: true }
)
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('Sekolah', 'Akademik', 'Kalender Akademik', props.mode)"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
		<div>
			<div v-if="!activeData" class="row my-4">
				<div class="col-4 d-flex align-items-center fw-bold fs-4">Kelas</div>
				<div class="col-8">
					<el-select
						@change="kelasChange()"
						v-model="form.kelas_id"
						multiple
						placeholder="Pilih Kelas"
						style="width: 100%"
						filterable
					>
						<el-option label="Pilih Semua" value="all"/>
						<el-option
							v-for="clas in kelas"
							:key="clas.kelas_id"
							:label="clas.kelas_nama"
							:value="clas.kelas_id"
						/>
					</el-select>
				</div>
			</div>
			<div v-if="!activeData" class="row my-4">
				<div class="col-4 d-flex align-items-center fw-bold fs-4">Tanggal</div>
				<div class="col-8">
					<el-date-picker
						v-model="dateRange"
						type="daterange"
						range-separator="Sampai"
						start-placeholder="Mulai libur"
						end-placeholder="Selesai libur"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
						size="large"
					/>
				</div>
			</div>
			<div v-if="activeData" class="row my-4">
				<div class="col-4 d-flex align-items-center fw-bold fs-4">Tanggal</div>
				<div class="col-8">
					<el-date-picker
						v-model="liburTanggal"
						type="date"
						placeholder="Tanggal libur"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
						size="large"
					/>
				</div>
			</div>
			<div class="row my-4">
				<div class="col-4 d-flex align-items-center fw-bold fs-4">Keterangan</div>
				<div class="col-8">
					<input type="text" v-model="form.libur_desc" class="form-control" placeholder=""/>
				</div>
			</div>
		</div>
	</Modal>
</template>