import React,{useEffect,useState} from 'react'
import {Container,Row,Col,Card,Button} from 'react-bootstrap'
import {
    Link
} from "react-router-dom"
import axios from 'axios'
import firebase from '../firebase'

function Part({match}){

    const [ImageURL,setImageURL] = useState([]) 

    useEffect(()=>{
        getImageURL();
    },[])

    const getImageURL = async () =>{
        try {
            //Get ImageData from firebase database.
            let response = await axios.post(
                'http://localhost:5000/venomous-snake/us-central1/app/image/getimage/',
                {
                    directory:match.params.snakename,
                    part:match.params.part
                }
            )
            let ImageData = response.data.ImageData
            //Get image url from firebase storage.
            const storageRef = firebase.storage().ref('testimage/'+match.params.snakename+'/'+match.params.part)
            let urls = []
            for(let i=0;i<ImageData.length;i++){
                let url = await storageRef.child(ImageData[i].name).getDownloadURL()
                urls.push(url)
            }
            setImageURL(urls)
        } catch (error) {
            throw error
        }
    }

    return(
        <div>
            <Container fluid>
                <Link to={'/reviews/'+match.params.snakename}>back</Link>
                <Row>
                {
                    ImageURL.map((url,i)=>
                    <Col key={i} className="mt-5 mx-4" lg={3} md={4} sm={6} xs={12}>
                        <Card className="shadow-lg bg-white rounded" style={{width:'18rem'}}>
                            <Card.Img style={{width:'18rem',height:'15rem'}} variant="top" src={url} />
                            <Card.Body>
                                <Card.Title>{match.params.snakename}</Card.Title>
                                <Button variant="primary">ดูรูปภาพ</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    )
                }
                </Row>
            </Container>
        </div>
    )
}

export default Part