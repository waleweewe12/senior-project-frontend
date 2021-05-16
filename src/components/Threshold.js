import React, { useState } from 'react';
import {
    Form,
    Button,
    Container,
    Row,
    Col
} from 'react-bootstrap';
import firebase from '../firebase'

function Threshold(){

    const [threshold, setThreshold] = useState({});
    const [part, setPart] = useState('body');
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
    
    const handleThresholdChanged = (e) =>{
        let snakeClass = e.target.attributes['snakeclass'].value;
        let dummy = {...threshold};
        dummy[snakeClass] = e.target.value;
        setThreshold(dummy);
    }

    const handlePartSelected = (e) =>{
        setPart(e.target.value);
    }

    const handleFormSubmitted = async (e) =>{ 
        e.preventDefault();
        for(const prop in threshold){
            threshold[prop] = parseFloat(threshold[prop]).toFixed(4);
        }
        //console.log(threshold);
        const db = firebase.firestore();
        try {
            await db.collection('threshold').doc(part).update(threshold);
            console.log('update success');
        } catch (error) {
            console.log(error);
            throw error;
        }
        setThreshold({});
        setUpdate(true);
    }

    return(
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h1>อัปเดตค่า Threshold</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="shadow-sm p-3 mb-5 bg-white rounded" md={6}>
                        <Form onSubmit={handleFormSubmitted}>
                            <Form.Group controlId="SelectCustomPart">
                                <Form.Label>Select part to update</Form.Label>
                                <Form.Control as="select" size="lg" custom onChange={handlePartSelected}>
                                    <option value="body">เต็มตัว</option>
                                    <option value="head">หัว</option>
                                    <option value="mid">ลำตัว</option>
                                    <option value="tail">หาง</option>
                                </Form.Control>
                            </Form.Group>
                            {snakeClass.map((value, index) => (
                                <Form.Group key={index}>
                                    <Form.Label>{value}</Form.Label>
                                    <Form.Control value={threshold[value] ? threshold[value] : ''} type="text" snakeclass={value} onChange={handleThresholdChanged}/>
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

export default Threshold;