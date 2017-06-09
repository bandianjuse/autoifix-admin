import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    content : '',
  },
  getters : {
    doneTodos(state){
      return 11
    }
  },
  mutations: {
    setContent(state,data){
      state.content = data;
    }
  },
  actions: {
    increment (context) {
      context.commit('setContent',10)
    }
  }
})
