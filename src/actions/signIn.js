const signin=(data)=>{
    return{
        type:'signin',
        username:data.username
    }
}

export default signin;