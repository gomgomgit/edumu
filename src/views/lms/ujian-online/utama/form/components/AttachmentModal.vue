<script setup>
import { onMounted, reactive, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router';
import { isEmpty, validate } from 'validate.js';
import { useToast } from 'vue-toast-notification';
// import sanitizeHtml from 'sanitize-html';
import qs from 'qs';

import { request, sanitizeHtml } from '@/util';
import Modal from '@/components/modals/CustomModal.vue'
import Spinner from '@/components/Spinner.vue';
import InlineEditor from '@/components/ckeditor-inline/Index.vue';

import useAttachment from '../composables/useAttachment.js'
import useQuestionsData from '../composables/useQuestionsData';

const { attachmentData, isAttachmentActive, resetAttachmentData } = useAttachment()
const { questionsData, isChanged } = useQuestionsData()

const initialForm = {
	attachment_title: '',
	attachment_content: '',
}

const activeTab = ref('list')
const activeAttachment = ref({})
const attachmentList = ref([])
const isLoading = ref(false)
const formData = reactive({ ...initialForm })

const examIdParam = computed(() => useRoute().params.exam_id)

function setActiveAttachment (attachment) {
	const isSelected = activeAttachment.value.attachment_id == attachment.attachment_id
	activeAttachment.value = isSelected ? {} : attachment
}

function loadAttachmentList () {
	isLoading.value = true
	request.post(
		'/v2dev/exam/attachment',
		qs.stringify({ exam_id: examIdParam.value })
	)
	.then(res => {
		const { data } = res.data
		attachmentList.value = data ?? []
		activeTab.value = data?.length ? 'list' : 'form'
	})
	.finally(() => isLoading.value = false)
}

function saveAttachment () {
	const errors = validate(formData, {
		attachment_title: { presence: { message: 'Judul tidak boleh kosong!' } },
		attachment_content: { presence: { message: 'Konten tidak boleh kosong!' } },
	}, {
		fullMessages: false,
		format: 'flat'
	})

	if (errors) return useToast().warning(errors[0])

	isLoading.value = true

	const targetUrl = formData.attachment_id ? '/v2dev/exam/attachment/edit' : '/v2dev/exam/attachment/create'
	const payload = {
		...formData,
		attachment_content: sanitizeHtml(formData.attachment_content),
		exam_id: examIdParam.value
	}

	request.post(targetUrl, qs.stringify(payload))
	.then(() => {
		Object.assign(formData, { ...initialForm })
		loadAttachmentList()
	})
	.finally(() => isLoading.value = false)
}

function chooseAttachment () {
	if (isEmpty(activeAttachment.value)) return useToast().warning('Pilih salah satu lampiran!')

	const question = questionsData
		.question_types[attachmentData.value.wrapperIndex]
		.questions[attachmentData.value.questionIndex]

	question.attachment_id = activeAttachment.value.attachment_id
	question.attachment_title = activeAttachment.value.attachment_title
	isChanged.value = true

	activeAttachment.value = {}
	resetAttachmentData()
}

function handleConfirm () {
	switch (activeTab.value) {
		case 'list': return chooseAttachment()
		case 'form': return saveAttachment()
	}
}

function closeModal () {
	activeAttachment.value = {}
	resetAttachmentData()
}

watch(
	attachmentData,
	function (data) {
		if (!data?.attachment_id) return
		activeAttachment.value = attachmentList.value.find(attch => attch.attachment_id == data.attachment_id)
	},
	{ deep: true }
)

onMounted(() => {
	loadAttachmentList()
})
</script>

<template>
	<Modal
		title="Lampiran Soal"
		:show="isAttachmentActive"
		:confirm-text="activeTab === 'list' ? 'Pilih' : 'Simpan'"
		@close-modal="closeModal"
		@dismiss="closeModal"
		@confirm="handleConfirm">

		<el-tabs v-model="activeTab" class="mb-8">
			<el-tab-pane label="Pilih Lampiran" name="list" class="pt-2">
				<div v-if="isLoading" class="d-flex justify-content-center h-200px">
					<Spinner />
				</div>

				<div v-else class="row">
					<div class="col-4">
						<div class="attachment-list border rounded-3 p-2">
							<p v-if="!attachmentList.length">Belum ada lampiran, silahkan buat baru.</p>
							<div v-else>
								<div
									v-for="attachment in attachmentList"
									:key="attachment.attachment_id"
									class="attachment-item pt-3 px-2"
									:class="{ 'attachment-item-active': attachment.attachment_id === activeAttachment.attachment_id }"
									@click="setActiveAttachment(attachment)">
									{{ attachment.attachment_title }}

									<hr class="mb-0 mt-3 border border-secondary">
								</div>
							</div>
						</div>
					</div>
					<div class="col-8">
						<div class="attachment-content h-100 border rounded-3 p-4">
							<span
								v-if="activeAttachment.attachment_content"
								v-html="sanitizeHtml(activeAttachment.attachment_content)">
							</span>
							<span v-else class="text-muted">Silahkan pilih lampiran yang tersedia.</span>
						</div>
					</div>
				</div>
			</el-tab-pane>

			<el-tab-pane label="Buat Baru" name="form" class="pt-2">
				<div v-if="isLoading" class="d-flex justify-content-center h-200px">
					<Spinner />
				</div>

				<div v-else class="row gy-6">
					<div class="col-4 d-flex align-items-center fw-bold fs-4">Judul Lampiran</div>
					<div class="col-8">
						<input
							v-model="formData.attachment_title"
							type="text"
							class="form-control" />
					</div>

					<div class="col-4 pt-2 fw-bold fs-4">Konten</div>
					<div class="col-8">
						<InlineEditor
							class="question-editor"
							v-model="formData.attachment_content" />
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</Modal>
</template>

<style scoped>
.attachment-list {
	overflow-y: auto;
	height: 40vh;
}
.attachment-item {
	border-radius: 7px;
	background-color: white;
	cursor: pointer;
	transition: background .2s;
}
.attachment-item:hover {
	background-color: #159BEA22;
}
.attachment-item-active {
	background-color: #159BEA;
	color: white;
}
</style>