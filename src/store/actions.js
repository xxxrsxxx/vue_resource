import { fetchApi } from '@/api/index';

export default {
	async FETCH_FN({ commit }, config) {
		const _obj = {
			ui: null,
			response: null,
			watcher: null,
		};
		for (var e in config) {
			const { key, params } = config[e];
			switch (e) {
				case 'UI':
					if (e && key) commit('SET_UI', { key: key, data: params });
					break;
				case 'WATCHER':
					if (e && key) commit('SET_WATCHER', { key: key, data: params });
					break;
				case 'API':
					if (e && key) {
						_obj.response = await fetchApi(key, params);
						commit('SET_API', { key: key, data: _obj.response });
					}
					break;
				default:
					console.log('FETCH_FN DEFAULT', e);
					break;
			}
		}
		return _obj;
	},
	FETCT_TEST({ commit }, val) {
		console.log('TEST_FETCH', val == 'array');
		var test = [1, 2, 3, 4];
		console.log('test1', Array.isArray(val));
		console.log(typeof val, val.length);
	},
};
