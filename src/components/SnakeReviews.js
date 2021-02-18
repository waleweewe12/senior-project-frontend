import React from 'react'
import {Button,Container,Row,Col,Card} from 'react-bootstrap'
import {
    Link
  } from "react-router-dom" 

function SnakeReviews({match}){

    const SnakeName = [
        'งูจงอาง',
        'งูเห่า',
        'งูสามเหลี่ยม',
        'งูทับสมิงคลา',
        'งูแมวเซา',
        'งูกะปะ',
        'งูเขียวหางไหม้ท้องเหลือง',
        'งูเขียวหางไหม้ลายเสือ',
        'งูเขียวหางไหม้ตาโต',
        'งูปล้องทอง',
        'งูต้องไฟ',
        'งูสามเหลี่ยมหัวแดงหางแดง',
        'งูปล้องหวายหัวดำ',
        'งูเขียวหางไหม้ภูเก็ต'
    ]

    return(
        <div>
            <Container fluid>
                <Row className="justify-content-center">
                    {
                        SnakeName.map((name,i)=>
                            <Col key={i} className="mt-5 mx-4" lg={3} md={4} sm={6} xs={12}>
                                <Card className="shadow-lg bg-white rounded" style={{width:'18rem'}}>
                                    <Card.Img style={{width:'18rem',height:'15rem'}} variant="top" src={"CoverImage/"+name+".jpg"}/>
                                    <Card.Body>
                                        <Card.Title style={{textAlign:'center'}}>{name}</Card.Title>
                                        <Link 
                                            style={{
                                                color:"white",
                                                textDecoration:"none",
                                            }} 
                                            to={match.url+'/'+name}>
                                            <Button
                                                style={{
                                                    width:'80%',
                                                    marginLeft:'10%',
                                                    marginRight:'10%',
                                                }} 
                                                variant="primary"
                                            >
                                                ดูรูปภาพ
                                            </Button>
                                        </Link>
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

export default SnakeReviews