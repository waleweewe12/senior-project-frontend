import React,{useState} from 'react'
import {useDispatch} from 'react-redux'
import submitlogin from '../actions/signIn'
import axios from 'axios'
import {Form,Button,Container,Row,Col} from 'react-bootstrap'
import './Login.css'
import firebase from '../firebase'

function Login(props){

    //const dispatch = useDispatch()
    const [email,Setemail] = useState('')
    const [password,Setpassword] = useState('')

    const submit = async(e)=>{
        e.preventDefault()
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            const user = firebase.auth().currentUser
            console.log(user.providerData[0].displayName)
        } catch (error) {
            console.log(error)
        }
        // try {
        //     let result = await axios.get('https://us-central1-venomous-snake.cloudfunctions.net/app/admin/')
        //     dispatch(submitlogin(result.data[0]))
        //     console.log("Login success!")
        // } catch (error) {
        //     console.log("Error From Login !")
        //     throw error
        // }
    }
    //signout
    const signOut = async(e) =>{
        e.preventDefault()
        try {
            await firebase.auth().signOut()
            console.log("sign out completed.")
        } catch (error) {
            console.log(error)
        }
    }
    //handle user_email
    const handleEmail = (e) => Setemail(e.target.value)
    //handle user_password
    const handlePassword = (e) => Setpassword(e.target.value)

    return (
        <div className="pt-5">
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Form className="shadow-lg p-3 mb-5 bg-white rounded" onSubmit={submit} >
                            <Form.Group  controlId="formBasicEmail">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="username" onChange={handleEmail}/>
                                <Form.Text className="text-muted">
                                    Enter username or email address.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group  controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={handlePassword} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Text>
                                    <a href="/">forget passwords?</a>
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Sign In
                            </Button>
                            <Button variant="danger" onClick={signOut}>
                                Sign Out
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login;