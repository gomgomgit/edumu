import axios from 'axios'
import { useToast } from 'vue-toast-notification';
import store from '../store';

const currentUser = store.getters.currentUser

const request = axios.create({
	baseURL: `${process.env.VUE_APP_API_URL}/${currentUser.sekolah_kode}/apischool`,
})

request.interceptors.request.use((config) => {
	config.params = config.params || {};
	config.params['id'] = currentUser.user_id ?? 0;
	return config;
});

request.interceptors.response.use(
	function (response)  {
		if (response.data?.status === false || response.data?.success === false) {
			useToast().warning(response.data?.text || response.data?.message || '???')
			throw response
		}
		return response
	},
	function (error) {
		useToast().error(error.message)

		if (error.response) {
			console.log(error.response)
			throw error.response
		} else {
			console.log(error)
			throw error
		}
	}
);

export default request