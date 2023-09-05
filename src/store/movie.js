import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

const _defaultMessage = 'Search for the movie title!'

export default {
  // module
  namespaced: true,

  // data
  // state: function () {
  //   return {
  //     movies: []
  //   }
  // },
  // 윗 내용 은 function 함수
  // 아래는 화살표 함수
  state: () => ({
    movies: [],
    message: _defaultMessage,
    loading: false,
    theMovie: {}
  }),

  // computed
  getters: {
    // movieIds(state) {
    //   return state.movies.map(m => m.imdbID)
    // }
  },

  // methods
  // 변이(데이터 변경 가능)
  mutations: {
    updateState(state, payload) {
      // 배열 이름으로 새로운 배열 반환
      // ['movies', 'message', 'loading']
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state) {
      state.movies = []
      state.message = _defaultMessage
      state.loading = false
    }
  },

  // 비동기 
  actions: {
    async searchMovies({ state ,commit }, payload) {
      if (state.loading) return

      commit('updateState', {
        message: '',
        loading: true
      })

      try {
        const res = await _fetchMovie({
          ...payload,
          page: 1
        })
        const { Search, totalResults } = res.data
        commit('updateState', {
          movies: _uniqBy(Search, 'imdbID')
        })
        console.log(totalResults)
        console.log(typeof totalResults)
  
        const total = parseInt(totalResults, 10)
        const pageLength = Math.ceil(total / 10) //ceil => 올린처리
  
        // 페이지 추가 요청
        if(pageLength > 1){
          for(let page = 2; page <= pageLength; page += 1 ){
            if(page > (payload.number / 10)) break
  
            const res = await _fetchMovie({
              ...payload,
              page
            })
            const { Search } = res.data
            commit ('updateState', {
              movies: [
                ...state.movies, 
                ..._uniqBy(Search, 'imdbID')
              ]
            })
          }
        }
      } catch ({ message }) {
        commit('updateState', {
          movies: [],
          message
        })
      } finally {
        commit('updateState',{
          loading: false
        })
      }
    },
    async searchMovieWithId({ state, commit }, payload) {
      if (state.loading) return

      commit('updateState',{
        theMovie: {},
        loading: true
      })

      try {
        const res = await _fetchMovie(payload)
        console.log(res.data)
        commit('updateState', {
          theMovie: res.data
        })
      } catch (error) {
        commit('updateState', {
          theMovie: {}
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    }
  }
} 

async function _fetchMovie(payload) {
 return await axios.post('/.netlify/functions.movie', payload)
}