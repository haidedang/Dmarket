

export const getProfile = async ({ commit }, users) => {
    console.log('entered action')
        let userName = await users.authenticate(); 
        console.log('dispatching action',userName)
        // this.userName = userName; 
        if(userName !== ''){
            commit('setProfile', userName)
        } else {
            console.log('please sign up')
        }
        
}

export const resetState = ({commit}) => {
    commit('resetState');
  }
   