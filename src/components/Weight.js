import React, { useState } from 'react';
import {
    Form,
    Button,
    Container,
    Row,
    Col
} from 'react-bootstrap';
import firebase from '../firebase'

function Weight(){

    const [weight, setWeight] = useState({});
    const [part, setPart] = useState('head');
    const [update, setUpdate] = useState(false);
    const snakeClass = [
        'งูเห่า',
        'งูจงอาง',
        'งูสามเหลี่ยม',
        'งูทับสมิงคลา',
        'งูแมวเซา',
        'งูกัปปะ',
        'งูเขียวหางไหม้ท้องเหลือง',
        'งูเขียวหางไหม้ตาโต',
        'งูเขียวหางไหม้ภูเก็ต',
        'งูเขียวหางไหม้ลายเสือ',
        'งูต้องไฟ',
        'งูปล้องทอง',
        'งูปล้องหวายหัวดำ',
        'งูสามเหลี่ยมหัวแดงหางแดง'
    ];
    
    const handleweightChanged = (e) =>{
        let snakeClass = e.target.attributes['snakeclass'].value;
        let dummy = {...weight};
        dummy[snakeClass] = e.target.value;
        setWeight(dummy);
    }

    const handlePartSelected = (e) =>{
        setPart(e.target.value);
    }

    const handleFormSubmitted = async (e) =>{ 
        e.preventDefault();
        for(const prop in weight){
            weight[prop] = parseInt(weight[prop]);
        }
        //console.log(weight);
        const db = firebase.firestore();
        try {
            await db.collection('weight').doc(part).update(weight);
            console.log('update success');
        } catch (error) {
            console.log(error);
            throw error;
        }
        setWeight({});
        setUpdate(true);
    }

    return(
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h1>อัปเดตค่า Weight</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="shadow-sm p-3 mb-5 bg-white rounded" md={6}>
                        <Form onSubmit={handleFormSubmitted}>
                            <Form.Group controlId="SelectCustomPart">
                                <Form.Label>Select part to update</Form.Label>
                                <Form.Control as="select" size="lg" custom onChange={handlePartSelected}>
                                    <option value="head">หัว</option>
                                    <option value="mid">ลำตัว</option>
                                    <option value="tail">หาง</option>
                                </Form.Control>
                            </Form.Group>
                            {snakeClass.map((value, index) => (
                                <Form.Group key={index}>
                                    <Form.Label>{value}</Form.Label>
                                    <Form.Control value={weight[value] ? weight[value] : ''} type="text" snakeclass={value} onChange={handleweightChanged}/>
                                </Form.Group>
                            ))}
                            {/* progress bar
                            {uploadProgress !== 100 && 
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width: uploadProgress + '%'}} aria-valuenow={uploadProgress.toString()} aria-valuemin="0" aria-valuemax="100">{uploadProgress}%</div>
                                </div>
                            }
                            {uploadSuccess && <div>Upload Success!</div>}
                            <Button className="mt-3" variant="primary" type="submit">
                                Upload
                            </Button> */}
                            {update === true && <div>Update Success!</div>}
                            <Button className="mt-3" variant="primary" type="submit">
                                Upload
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Weight;