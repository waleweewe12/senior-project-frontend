import { blob } from 'jszip/lib/support';
import React, { useState, useEffect } from 'react';
import {
    Container, 
    Row, 
    Form, 
    Button,
    Col
} from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import firebase from '../firebase';

function UserImage(){

    const [userResult, setUserResult] = useState([]);
    const [snakeType, setSnakeType] = useState({});
    const snakeName = {
        '0':'งูจงอาง',
        '1':'งูเห่า',
        '2':'งูสามเหลี่ยม',
        '3':'งูทับสมิงคลา',
        '4':'งูแมวเซา',
        '5':'งูกะปะ',
        '6':'งูเขียวหางไหม้ท้องเหลือง',
        '7':'งูเขียวหางไหม้ลายเสือ',
        '8':'งูเขียวหางไหม้ตาโต',
        '9':'งูปล้องทอง',
        '10':'งูต้องไฟ',
        '11':'งูสามเหลี่ยมหัวแดงหางแดง',
        '12':'งูปล้องหวายหัวดำ',
        '13':'งูเขียวหางไหม้ภูเก็ต'
    };

    const handleSnakeTypeSelected = (e)=>{
        e.preventDefault();
        snakeType[e.target.attributes['index'].value] = e.target.value;
    }

    const handleAddImageClicked = async (e)=>{
        e.preventDefault();
        let timestamp = e.target.attributes['timestamp'].value;
        let section = e.target.attributes['section'].value;
        let index = e.target.attributes['index'].value;
        let type =  index === undefined ? 'งูจงอาง' : snakeType[index];
        const storageRef = firebase.storage().ref('testimage/' + type + '/' + section + '/'  + new Date().getTime() + '.jpg');
        const db = firebase.firestore();
        try {
            //get image from url and put image to cloud storage
            let response = await fetch(e.target.attributes['url'].value);
            response = await response.blob();
            await storageRef.put(response);
            //get old data from firestore
            let oldData = await db.collection('result').doc(timestamp).get();
            oldData = oldData.data();
            //update data and save to firestore
            oldData['status'] = 'อัพโหลดแล้ว';
            await db.collection('result').doc(timestamp).set(oldData);
            //change status at frontend
            let dummyUserResult = [...userResult];
            dummyUserResult[index]['status'] = 'อัพโหลดแล้ว';
            setUserResult(dummyUserResult);
            
            console.log('Add image success');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const timestampToDate = (timestamp)=>{
        let dateTime = new Date(timestamp).toLocaleString();
        return dateTime;
    }
    
    useEffect(()=>{
        async function getPredictedData(){
            const db = firebase.firestore();
            try {
                let result  = await db.collection('result').get();
                let allUserResult = [];
                result.forEach((doc)=>{
                    let scores = [['Task', 'Venomous Predicted']];
                    for(const score in doc.data().predicted){
                        scores.push([snakeName[score], parseFloat(doc.data().predicted[score] * 10)]);
                    }
                    allUserResult.push({
                        status:doc.data().status,
                        dateTime:doc.data().dateTime,
                        section:doc.data().section,
                        imageUrl:doc.data().imageUrl,
                        scores
                    });
                    //console.log(scores)
                    //console.log(doc.data().imageUrl);
                })
                // console.log(allUserResult);
                setUserResult(allUserResult);
                //setImageUrl(allImageUrl);
            } catch (error) {
                console.log(error);
                throw error;
            }
        };
        getPredictedData();
    }, [])

    return(
        <>
            <Container >
                {userResult.map((item, index)=>
                    <Row
                        key={index}
                        className="shadow-lg bg-white rounded"
                        style={{
                            marginTop:'25px'
                        }}
                    >
                        <Col lg={4} md={6} sm={12}>
                            <img
                                style={{
                                    width:'80%',
                                    marginTop:'10%',
                                    marginLeft:'10%',
                                    marginRight:'10%'
                                }} 
                                src={item.imageUrl} 
                                alt="..."
                            />
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <Chart
                                // width={'500px'}
                                // height={'300px'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={item.scores}
                                options={{
                                    title: 'Venomous Snake Predicted',
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            />
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <div
                                style={{
                                    width:'60%',
                                    marginLeft:'auto',
                                    marginRight:'auto',
                                    marginTop:'10%',
                                }}
                            >
                                <p>section : {item.section}</p>
                                <p>วันที่ส่ง : {timestampToDate(item.dateTime)}</p>
                                <p>สถานะ : {item.status}</p>
                            </div>
                            <Form 
                                style={{
                                    width:'60%',
                                    marginLeft:'auto',
                                    marginRight:'auto',
                                    marginTop:'10%',
                                }}
                            >
                                <Form.Group controlId="SelectCustomVenomousSnake">
                                    <Form.Label>Custom select venomous snake type</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        size="lg" 
                                        custom
                                        index={index} 
                                        onChange={handleSnakeTypeSelected}
                                    >
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

                                <Button
                                    style={{
                                        marginBottom:'10%'
                                    }} 
                                    variant="primary" 
                                    type="submit"
                                    index={index}
                                    section={item.section}
                                    url={item.imageUrl}
                                    timestamp={item.dateTime}
                                    onClick={handleAddImageClicked}
                                >
                                    Upload
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                )}
                {/* <Row
                    className="shadow-lg bg-white rounded"
                    style={{
                        marginTop:'25px'
                    }}
                >
                    <Col lg={4} md={6} sm={12}>
                        <img
                            style={{
                                width:'16rem',
                            }} 
                            src="https://i.pinimg.com/originals/ab/8a/5a/ab8a5a78e011d1a5cad724c31204a27e.jpg" 
                            alt="..."
                        />
                    </Col>
                    <Col lg={4} md={6} sm={12}>
                        <Chart
                            // width={'500px'}
                            // height={'300px'}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Task', 'Venomous Predicted'],
                                ['Work', 11],
                                ['Eat', 2],
                                ['Commute', 2],
                                ['Watch TV', 2],
                                ['Sleep', 7],
                            ]}
                            options={{
                                title: 'Venomous Snake Predicted',
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </Col>

                    <Col lg={4} md={6} sm={12}>
                        <div
                            style={{
                                width:'60%',
                                marginLeft:'auto',
                                marginRight:'auto',
                                marginTop:'10%',
                            }}
                        >
                            <p>section : หาง</p>
                            <p>วันที่ส่ง : ""</p>
                            <p>สถานะ : อัพโหลดแล้ว</p>
                        </div>
                        <Form 
                            style={{
                                width:'60%',
                                marginLeft:'auto',
                                marginRight:'auto',
                                marginTop:'10%',
                            }}
                        >
                            <Form.Group controlId="SelectCustomVenomousSnake">
                                <Form.Label>Custom select venomous snake type</Form.Label>
                                <Form.Control as="select" size="lg" custom onChange={handleSnakeTypeSelected}>
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

                            <Button variant="primary" type="submit">
                                Upload
                            </Button>
                        </Form>
                    </Col>
                </Row> */}
            </Container>
        </>
    )
}

export default UserImage;