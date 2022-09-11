<script setup>
import Modal from '@/components/modals/CustomModal.vue';
import { request } from '@/util';
import qs from 'qs';
import { isEmpty } from 'validate.js';
import { computed, ref, watch } from 'vue';
import Spinner from '@/components/Spinner.vue';

const emit = defineEmits(['closeModal'])

const props = defineProps({
	activeData: { type: Object, default: () => ({}) }
})

const classList = ref([])
const studentList = ref([])
const studentRemedList = ref([])
const isLoading = ref(true)

const activeClass = ref(null)
const checkedStudents = ref({})

const studentKeyword = ref('')
const remedStudentKeyword = ref('')
const filteredStudentList = ref([])
const filteredStudentRemedList = ref([])

const isShow = computed(() => !isEmpty(props.activeData))

function evaluateUniqueStudents (data) {
	return data.filter(function({user_id, siswa_id}) {
		const key = `${user_id}-${siswa_id}`;
		return !this.has(key) && this.add(key);
	}, new Set);
}

function getStudentList () {
	isLoading.value = true
	request.post('ujian/siswa/remed', qs.stringify({
		exam_id: props.activeData.exam_id,
		participant_id: activeClass.value
	})).then(res => {
		studentList.value = evaluateUniqueStudents(res.data.data.userAll)
		studentRemedList.value = evaluateUniqueStudents(res.data.data.userRemed)
	}).finally(() => {
		isLoading.value = false
	})
}

function getClassList () {
	isLoading.value = true
	request.post('exam/participant', qs.stringify({
		exam_id: props.activeData.exam_id
	})).then(res => {
		classList.value = res.data.data.participant
	}).finally(() => {
		isLoading.value = false
	})
}

function handleCheckStudent (evt, studentId) {
	if (evt.target.checked && studentId) {
		checkedStudents.value[studentId] = studentId
	} else {
		const isExists = checkedStudents.value[studentId]
		if (isExists) delete checkedStudents.value[studentId]
	}
}

function submitRemedStudent () {
	isLoading.value = true
	request.post('ujian/siswa/addremed', qs.stringify({
		examId: props.activeData.exam_id,
		userId: Object.values(checkedStudents.value)
	})).then(res => {
		checkedStudents.value = {}
		getStudentList()
	}).finally(() => {
		isLoading.value = false
	})
}

function deleteRemedStudent (studentId) {
	isLoading.value = true
	request.post('ujian/siswa/delremed', qs.stringify({
		examId: props.activeData.exam_id,
		userId: studentId
	})).then(res => {
		checkedStudents.value = {}
		getStudentList()
	}).finally(() => {
		isLoading.value = false
	})
}

function closeModal () {
	activeClass.value = null
	checkedStudents.value = {}
	emit('closeModal')
}

watch(
	isShow,
	val => {
		if (val) {
			getStudentList()
			getClassList()
		}
	},
	{ immediate: true }
)

watch(activeClass, () => !isEmpty(classList.value) && getStudentList())
</script>

<template>
	<Modal
		title="Pilih Siswa Remedial"
		confirm-text="Selesai"
		:show="isShow"
		@closeModal="closeModal"
		@confirm="closeModal"
		@dismiss="closeModal">
		<div v-if="isLoading" class="d-flex justify-content-center py-5">
			<Spinner />
		</div>

		<div v-else class="row mt-4">
			<section class="col-12">
				<el-select
					class="w-100"
					v-model="activeClass"
					placeholder="Semua Kelas"
					clearable>
					<el-option
						:value="null"
						label="Semua Kelas"/>
					<el-option
						v-for="classItem in classList"
						:key="classItem.participant_id"
						:value="classItem.participant_id"
						:label="classItem.kelas_nama" />
				</el-select>
			</section>

			<section class="col-6">
				<div class="card shadow-none border mt-8">
					<h5 class="card-header d-flex align-items-center justify-content-between p-6">
						Daftar Siswa
						<button
							class="btn btn-sm btn-primary"
							:disabled="isEmpty(checkedStudents)"
							@click="submitRemedStudent">
							Remed &nbsp; <i class="fas fa-angle-double-right"></i>
						</button>
					</h5>
					<div class="card-body p-6">
						<label
							v-for="student in studentList"
							:key="student.user_id"
							role="button"
							class="w-100 py-6 border-bottom">
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox" value=""
									:id="'student-' + student.user_id"
									:checked="checkedStudents[student.user_id]"
									@change="handleCheckStudent($event, student.user_id)">
								<label class="form-check-label" :for="'student-' + student.user_id">
									{{ student.user_nama }}
								</label>
							</div>
						</label>
					</div>
				</div>
			</section>

			<section class="col-6">
				<div class="card shadow-none border mt-8">
					<h5 class="card-header d-flex align-items-center justify-content-between p-6">
						Siswa Yang Remedial
					</h5>
					<div class="card-body p-6">
						<label
							v-for="student in studentRemedList"
							:key="student.user_id"
							role="button"
							class="w-100 py-4 border-bottom d-flex justify-content-between align-items-center">
							{{ student.user_nama }}
							<button class="btn btn-danger btn-sm" @click="deleteRemedStudent(student.user_id)">
								<i class="fas fa-angle-double-left"></i>
								Hapus
							</button>
						</label>
					</div>
				</div>
			</section>
		</div>
	</Modal>
</template>