<script setup>
import PratinjauHeaderItem from './components/PratinjauHeaderItem.vue';
</script>

<template>
	<div id="pratinjau-ujian">
		<header class="row mt-8">
			<section class="col-6">
				<div class="border border-2 rounded-3 d-flex h-100">
					<div class="header-section-item-left p-5 d-flex flex-column gap-8">
						<PratinjauHeaderItem
							color="warning"
							icon="uil-atom"
							content="Tryout Kimia Dasar Semester Genap 2022 Kelas IPA" />

						<section class="d-flex align-items-center">
							<!-- foto orang -->
						</section>
					</div>

					<div class="header-section-item-right p-5 d-flex flex-column gap-8">
						<PratinjauHeaderItem
							color="info"
							icon="uil-edit"
							title="Jumlah Soal"
							content="25 Soal" />
						<PratinjauHeaderItem
							color="success"
							icon="uil-clipboard-notes"
							title="Bentuk Soal"
							content="20 PG, 5 Essay" />
						<PratinjauHeaderItem
							color="danger"
							icon="uil-comment-alt-notes"
							title="Total Nilai"
							content="100" />
					</div>
				</div>
			</section>

			<section class="col-6">
				<div class="border border-2 rounded-3 d-flex h-100">
					<div class="header-section-item-left p-5">
						test
					</div>
					<div class="header-section-item-right p-5">
						test
					</div>
				</div>
			</section>
		</header>
	</div>
</template>

<style scoped>
.header-section-item-left {
	width: 62.5%;
	border-right: 2px #EFF2F5 dashed;
}
.header-section-item-right {
	width: 37.5%;
}
</style>