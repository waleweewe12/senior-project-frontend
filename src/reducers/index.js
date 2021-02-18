//import registerReducer from './register'
import SignInReducer from './SignInReducer'
import {combineReducers} from 'redux'

const AllReducers=combineReducers({
    SignIn:SignInReducer
})

export default AllReducers;