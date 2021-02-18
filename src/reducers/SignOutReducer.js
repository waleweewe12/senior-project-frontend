const data = {
    username:""
}

const SignInReducer=(state=data,action)=>{
    switch(action.type){
        case "signout":
            return{
                ...state,
                username:action.username
            }
        default:
            return state
    }
}

export default SignInReducer;