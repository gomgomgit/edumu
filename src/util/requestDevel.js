import axios from 'axios'
import { useToast } from 'vue-toast-notification';

const request = axios.create({
	baseURL: `https://truce-dev.my.id`,
})

request.interceptors.request.use((config) => {
	config.params = config.params || {};
	config.params['id'] = 1;
	return config;
});

request.interceptors.response.use(
	function (response)  {
		if (response.data?.status === false || response.data?.success === false) {
			useToast().error(response.data.message)
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