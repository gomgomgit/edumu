<script setup>
import { reactive, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import { useStore } from "vuex"

const props = defineProps({
	mode: { type: String, required: true },
	activeData: { type: Object, required: true },
})

const store = useStore()

const userId = store.getters.currentUser.user_id 

const emits = defineEmits(['close', 'submit'])

const initialForm = { exam_cat_id: '', exam_cat_name: '', exam_cat_type: ''}

const formData = reactive({...initialForm})

function handleClose () {
	Object.assign(formData, {...initialForm})
	emits('close')
}

function handleSubmit () {
	const endpoint = isEmpty(props.activeData) ? 'examkat/add' : 'examkat/edit'
	const message = isEmpty(props.activeData) ? 'Ditambahkan!' : 'Diubah!'
	isEmpty(props.activeData) ? formData.created_by = userId : formData.modified_by = userId

	request.post(endpoint, qs.stringify(formData)).then(() => {
		Object.assign(formData, initialForm)
		useToast().success('Data Berhasil ' + message)
		emits('submit')
		emits('close')
	})
}

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && Object.assign(formData, { ...activeData, isActive: activeData.exam_cat_status }),
	{ deep: true }
)
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('LMS', 'Ujian Online', 'Kategori', props.mode)"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
		<div class="row gy-6">
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Jenis Kategori</div>
			<div class="col-8">
        <el-select
          v-model="formData.exam_cat_type"
          placeholder="Pilih Jenis"
          class="w-100"
        >
          <el-option label="Tugas" value="tugas"/>
          <el-option label="Ujian" value="exam"/>
        </el-select>
			</div>
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Nama Grup Iuran</div>
			<div class="col-8">
				<input
					v-model="formData.exam_cat_name"
					type="text"
					class="form-control" />
			</div>
			
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Status</div>
			<div class="col-8">
				<div class="form-check form-check-inline">
					<input
						v-model="formData.isActive"
						class="form-check-input"
						type="radio"
						id="mapel-status-1"
						:value="1">
					<label class="form-check-label" for="mapel-status-1">Aktif</label>
				</div>
				<div class="form-check form-check-inline">
					<input
						v-model="formData.isActive"
						class="form-check-input"
						type="radio"
						id="mapel-status-0"
						:value="0">
					<label class="form-check-label" for="mapel-status-0">Non Aktif</label>
				</div>
			</div>
		</div>
	</Modal>
</template>