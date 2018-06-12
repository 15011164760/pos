import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={
    count:2
}
const mutations={
	add(state,n){
        state.count+=n;
	},
	reduce(state){
        state.count--;
	}
}
const getters={
  count:function(state){
     return state.count+=100
  }
}
// const moduleA={
//   state,mutations,getters,actions
// }
export default new Vuex.Store({
	state,mutations,getters
})
