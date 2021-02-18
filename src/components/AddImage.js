import React,{useState} from 'react'
import {Form,Button,Container,Row,Col} from 'react-bootstrap'
import firebase from '../firebase'


function AddImage(){

    const [images,Setimages] = useState(null)
    const [bodypart,Setbodypart] = useState("fullBody")
    const [SnakeType,SetSnakeType] = useState("งูจงอาง")
    const [UploadProgress,SetUploadProgress] = useState(0)
    const [UploadSuccess,setUploadSuccess] = useState(false)

    const upload = async (e)=>{
        e.preventDefault();
        setUploadSuccess(false);
        const db = firebase.firestore();
        for(let i = 0; i < images.length; i++){
            let storageRef = firebase.storage().ref('testimage/'+SnakeType+'/'+bodypart+'/'+images[i].name)
            setUploadSuccess(false)
            try {
                await storageRef.put(images[i]);
                let url = await storageRef.getDownloadURL();
                await db.collection('images').doc().set({
                    snakeType:SnakeType,
                    bodypart,
                    imageUrl:url,
                    path:'testimage/' + SnakeType + '/' + bodypart + '/' + images[i].name,
                    createAt:new Date().getTime()
                }); 
                SetUploadProgress( (i+1) / images.length * 100 );
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
        SetUploadProgress(0);
        setUploadSuccess(true);
        console.log('upload success');  
    }
    //set image file
    const choosefile = (e)=> Setimages(e.target.files)
    //set body-part
    const HandlePartSelected = (e)=> Setbodypart(e.target.value)
    //set snake type
    const HandleSnakeTypeSelected = (e) => SetSnakeType(e.target.value)

    return(
        <div>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col className="shadow-sm p-3 mb-5 bg-white rounded" md={6}>
                        <Form onSubmit={upload}>
                            <Form.Group>
                                <Form.Text>
                                    ใส่รูปภาพ
                                </Form.Text>
                                <Form.File 
                                    id="custom-file"
                                    label={images ? images.length + " file":""}
                                    multiple
                                    accept="image/*" 
                                    custom
                                    onChange={choosefile}
                                />
                            </Form.Group>

                            <Form.Group controlId="SelectCustomVenomousSnake">
                                <Form.Label>Custom select venomous snake type</Form.Label>
                                <Form.Control as="select" size="lg" custom onChange={HandleSnakeTypeSelected}>
                                    <option value="งูจงอาง">งูจงอาง</option>
                                    <option value="งูสามเหลี่ยม">งูสามเหลี่ยม</option>
                                    <option value="งูเห่า">งูเห่า</option>
                                    <option value="งูทับสมิงคลา">งูทับสมิงคลา</option>
                                    <option value="งูแมวเซา">งูแมวเซา</option>
                                    <option value="งูกัปปะ">งูกัปปะ</option>
                                    <option value="งูเขียวหางไหม้ท้องเหลือง">งูเขียวหางไหม้ท้องเหลือง</option>
                                    <option value="งูเขียวหางไหม้ตาโต">งูเขียวหางไหม้ตาโต</option>
                                    <option value="งูเขียวหางไม้ภูเก็ต">งูเขียวหางไม้ภูเก็ต</option>
                                    <option value="งูเขียวหางไหม้ลายเสือ">งูเขียวหางไหม้ลายเสือ</option>
                                    <option value="งูต้องไฟ">งูต้องไฟ</option>
                                    <option value="งูปล้องทอง">งูปล้องทอง</option>
                                    <option value="งูปล้องหวายหัวดำ">งูปล้องหวายหัวดำ</option>
                                    <option value="งูสามเหลี่ยมหัวแดงหางแดง">งูสามเหลี่ยมหัวแดงหางแดง</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="SelectCustomBodyPart">
                                <Form.Label>Custom select body-part</Form.Label>
                                <Form.Control as="select" size="lg" custom onChange={HandlePartSelected}>
                                    <option value="fullBody">เต็มตัว</option>
                                    <option value="head">หัว</option>
                                    <option value="bodyPart">ลำตัว</option>
                                    <option value="tail">หาง</option>
                                </Form.Control>
                            </Form.Group>
                            {/* progress bar */}
                            {UploadProgress !== 0 &&
                                <> 
                                    <div>Uploading ...... </div>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar" style={{width: UploadProgress+"%"}} aria-valuenow={UploadProgress.toString()} aria-valuemin="0" aria-valuemax="100">{UploadProgress}%</div>
                                    </div>
                                </>
                            }
                            { !UploadSuccess ? "" : <div>Upload Success!</div>}
                            <Button className="mt-3" variant="primary" type="submit">
                                Upload
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AddImage 