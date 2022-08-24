import { ref, reactive, computed } from 'vue'
import { isEmpty } from 'validate.js'

import requestDevel from '@/util/requestDevel'

const attachmentData = ref({})

const isAttachmentActive = computed(() => !isEmpty(attachmentData.value))

function setAttachmentData (question, wrapperIndex, questionIndex) {
	attachmentData.value = {
		...question,
		wrapperIndex,
		questionIndex
	}
}

function resetAttachmentData () {
	attachmentData.value = {}
}

export default function () {
	return { attachmentData, isAttachmentActive, setAttachmentData, resetAttachmentData }
}