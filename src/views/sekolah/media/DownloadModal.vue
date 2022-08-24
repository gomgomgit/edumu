<script setup>
import { onMounted, reactive, ref, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import { useStore } from "vuex"

const props = defineProps({
	file: { type: String, required: true },
})


const emits = defineEmits(['close'])

function handleClose () {
	emits('close')
}
</script>

<template>
	<Modal
		title="Data Media"
		:show="props.file"
		:breadcrumb="Array('Sekolah', 'Media', 'Album', 'Data Media')"
		:dismissable='false'
		@closeModal="handleClose"
		confirmText="Tutup"
		@confirm="handleClose"
		@dismiss="handleClose">
		<div>
			<div class="fs-5">
				Sukses membuat file Zip, <a :href="`https://apistaging.edumu.id/${file}`">Klik disini</a> untuk mendownload file
			</div>
			<div class="d-flex justify-content-center mt-5">
				<div>
					<a :href="`https://apistaging.edumu.id/${file}`" class="btn btn-primary d-flex gap-4 align-items-center w-auto">
						<span>
							Download
						</span>
						<i class="bi bi-cloud-arrow-up fs-1"></i>
					</a>
				</div>
			</div>
		</div>
	</Modal>
</template>