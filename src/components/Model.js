import React, {useState} from 'react';
import {
    Form,
    Button,
    Container,
    Row,
    Col
} from 'react-bootstrap';
import firebase from '../firebase'

function Model(){

    const [model, setModel] = useState('body');
    const [file, setFile] = useState(null);

    const handleModelSelected = (e)=>{
        setModel(e.target.value);
    };

    const chooseFile = (e)=>{
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    };

    const upload = async (e)=>{
        e.preventDefault();
        let fileName = new Date().getTime() + '.h5'
        const storageRef = firebase.storage().ref('model/' + model + '/' + fileName);
        const db = firebase.firestore();
        try {
            await storageRef.put(file);
            console.log('upload model success');
            let url = await storageRef.getDownloadURL();
            await db.collection('model').doc(model).set({
                timestamp:new Date().getTime(),
                fileName,
                model,
                url
            });
            console.log('save data success');
        } catch (error) {
            console.log(error);
            throw error;
        }
    };


    return(
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col className="shadow-sm p-3 mb-5 bg-white rounded" md={6}>
                        <Form onSubmit={upload}>
                            <Form.Group>
                                <Form.Label>Input Model</Form.Label>
                                <Form.File 
                                    id="custom-file"
                                    label={!file ? '':file.name+''}
                                    custom
                                    onChange={chooseFile}
                                />
                            </Form.Group>

                            <Form.Group controlId="SelectCustomVenomousSnake">
                                <Form.Label>Custom select venomous snake type</Form.Label>
                                <Form.Control as="select" size="lg" custom onChange={handleModelSelected}>
                                    <option value="body">body</option>
                                    <option value="head">head</option>
                                    <option value="mid">mid</option>
                                    <option value="tail">tail</option>
                                </Form.Control>
                            </Form.Group>

                            {/* progress bar */}
                            {/* {UploadProgress !== 0 && 
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width: UploadProgress+"%"}} aria-valuenow={UploadProgress.toString()} aria-valuemin="0" aria-valuemax="100">{UploadProgress}%</div>
                                </div>
                            }
                            { !UploadSuccess ? "" : <div>Upload Success!</div>} */}
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

export default Model;