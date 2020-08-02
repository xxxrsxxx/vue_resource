export default {
	SET_NAV(state, data) {
		state.nav = data;
	},
	SET_UI(state, res) {
		if (!res) return;
		const { key, data } = res;
		if (!state.UI[key]) state.UI[key];
		state.UI[key] = {
			value: data,
		};
	},
	SET_API(state, res) {
		if (!res) return;
		const { key, data } = res;
		if (!state.API[key]) state.API[key];
		state.API[key] = {
			data: data,
		};
	},
	SET_WATCHER(state, res) {
		if (!res) return;
		const { key, data } = res;
		if (!state.WATCHER[key]) state.WATCHER[key];
		state.WATCHER[key] = {
			value: data,
		};
	},
};
