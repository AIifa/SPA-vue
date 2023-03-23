import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import menu from './modules/menu';
import taskList from './modules/taskList';
import addMenu from './modules/addMenu';
import delMenu from './modules/delMenu';

export default new Vuex.Store({
	modules: {
		menu,
		taskList,
		addMenu,
		delMenu,
	},
	strict: process.env.NODE_ENV !== 'production'
})