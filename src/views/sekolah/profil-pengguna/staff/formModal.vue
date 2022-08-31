<script setup>
import { reactive, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";

const props = defineProps({
	mode: { type: String, required: true },
	activeData: { type: Object, required: true },
})

const emits = defineEmits(['close', 'submit'])

const initialForm = { user_id: '', user_level: null, user_nama: null, user_username: null, user_passw: null, user_status: null, user_status: null }

const formData = reactive({...initialForm})

const userLevel = [
  {
    label: 'Administrator',
    value: 'administrator'
  },
  {
    label: 'Admin Konten',
    value: 'admin_konten'
  },
  {
    label: 'Akademik',
    value: 'akademik'
  },
  {
    label: 'Keuangan',
    value: 'keuangan'
  },
  {
    label: 'Guru',
    value: 'guru'
  },
]

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && Object.assign(formData, {...activeData}),
	{ deep: true }
)

function handleClose () {
	Object.assign(formData, {...initialForm})
	emits('close')
}

function handleSubmit () {
	const endpoint = isEmpty(props.activeData) ? 'user/add' : 'user/edit'
	request.post(endpoint, qs.stringify(formData)).then(() => {
		Object.assign(formData, initialForm)
		useToast().success('Data Berhasil Ditambahkan!')
		emits('submit')
		emits('close')
	})
}
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('Sekolah', 'Mata Pelajaran', 'Data Mapel', props.mode)"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
		<div class="row gy-6">
      <div class="col-4 d-flex align-items-center fw-bold fs-4">User Level</div>
      <div class="col-8">
        <select v-model="formData.user_level" class="form-select form-select-solid" aria-label="Select level">
          <template v-for="lev, index in userLevel" :key="index">
            <option :value="lev.value">{{lev.label}}</option>
          </template>
        </select>
      </div>
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Nama Lengkap</div>
			<div class="col-8">
				<input
					v-model="formData.user_nama"
					type="text"
					class="form-control" />
			</div>
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Username</div>
			<div class="col-8">
				<input
					v-model="formData.user_username"
					type="text"
					class="form-control" />
			</div>
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Password</div>
			<div class="col-8">
				<input
					v-model="formData.user_passw"
					type="password"
					class="form-control" />
			</div>
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Status Akun</div>
			<div class="col-8">
				<div class="form-check form-check-inline">
					<input
						v-model="formData.user_status"
						class="form-check-input"
						type="radio"
						id="mapel-status-1"
						:value="1">
					<label class="form-check-label" for="mapel-status-1">Aktif</label>
				</div>
				<div class="form-check form-check-inline">
					<input
						v-model="formData.user_status"
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