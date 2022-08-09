<script setup>
import QuestionWrapper from './QuestionWrapper.vue'

defineProps({
	orderNumber: Number,
	wrapperIndex: [Number, String],
	questionIndex: [Number, String],
	question: { type: Object, default: () => ({}) },
})
</script>

<template>
	<QuestionWrapper v-bind="{ orderNumber, wrapperIndex, questionIndex, question }" />
</template>