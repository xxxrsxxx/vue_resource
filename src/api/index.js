import axios from 'axios';

function createInstance() {
	const instance = axios.create({
		baseURL: process.env.VUE_APP_API_URL,
		// headers:{
		//
		// }
	});
	return instance;
}

const instance = createInstance();

async function fetchApi(key, params) {
	try {
		const res = await instance.get(`json/${key}.json`);
		return res.data;
	} catch (e) {
		console.log('api error', e);
	}
}

export { fetchApi };
