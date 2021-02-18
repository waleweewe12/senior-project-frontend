import React, {useState,useEffect} from 'react'
import {
    Container, 
    Nav, 
    Row, 
    Col, 
    Card, 
    Button, 
    Spinner, 
    Modal, 
    ProgressBar
} from 'react-bootstrap'
import firebase from '../firebase'
import {saveAs} from 'file-saver'
import jszip from 'jszip'
import axios from 'axios'

function SnakeCustom({match}){

    const [snakePart, setSnakePart] = useState("fullBody")
    const [imageUrl, setImageUrl] = useState({
        fullBody:[],
        head:[],
        bodyPart:[],
        tail:[]
    })
    const [showImage, setShowImage] = useState([])
    const [fullLoad, setFullLoad] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [targetImageDelete, setTargetImageDelete] = useState(0)
    const [imageDownloadProgress, setImageDownloadProgress] = useState(100)

    const handleSnakePartClicked = (e)=>{
        let part = e.target.attributes['part'].value;
        setSnakePart(part);
    }

    const handleModalShow = (e)=>{
        setTargetImageDelete(e.target.attributes['index'].value);
        setShowModal(!showModal);
    }

    const handleModalClose = (e)=>{
        setShowModal(!showModal);
    }

    const handleDeleteImage = async (e)=>{

        let urlPart = {...imageUrl}[snakePart];
        let path = urlPart[targetImageDelete]['path'];
        let id = urlPart[targetImageDelete]['id'];
        //delete from current array
        urlPart.splice(targetImageDelete, 1);
        let dummyImageUrl = {...imageUrl};
        dummyImageUrl[snakePart] = urlPart;
        setImageUrl(dummyImageUrl);
        setShowModal(!showModal);
        //delete from firestore
        const db = firebase.firestore();
        try {
            await db.collection('images').doc(id).delete();
        } catch (error) {
            throw error;
        }
        //delete from firebase storage
        const storageRef = firebase.storage().ref();
        let desertRef = storageRef.child(path);
        desertRef.delete().then(() => {
            //console.log('delete file success!')
        }).catch((error) => {
            throw error;
        })
    }

    const downloadImage = async ()=>{
        setImageDownloadProgress(0);
        const config = { responseType: 'blob' };
        const zip = jszip();
        try {
            for(let i = 0; i < imageUrl[snakePart].length; i++){
                let response = await axios.get(imageUrl[snakePart][i].url, config);
                let file = new File([response.data], 'snake.jpg');
                zip.file(match.params.snakename + '_' + snakePart + '_' + (i + 1) + '.jpg', file, {blob:true});
            }
            let content = await zip.generateAsync({type:"blob"}, (metadata)=>{
                console.log("progression: " + metadata.percent.toFixed(2) + " %");
                setImageDownloadProgress(parseInt(metadata.percent.toFixed(2)));
            });
            saveAs(content, match.params.snakename + '_' + snakePart + '.zip');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    useEffect(()=>{
        async function loadimage(){
            const db = firebase.firestore();
            const imagesKey = ['fullBody', 'head', 'bodyPart', 'tail'];
            let allImageUrl = {};
            try {
                for(let key of imagesKey){
                    allImageUrl[key] = [];
                    let snapshot = await db.collection('images').where('snakeType', '==', match.params.snakename).where('bodypart', '==', key).get();
                    snapshot.forEach(doc => {
                        allImageUrl[key].push({
                            url:doc.data()['imageUrl'],
                            path:doc.data()['path'],
                            id:doc.id
                        })
                    });
                }
                setImageUrl(allImageUrl);
                setFullLoad(true);
            } catch (error) {
                throw error;
            }
        } 
    
    loadimage();
    }, [match]);

    useEffect(()=>{
        setShowImage(imageUrl[snakePart])
    },[snakePart, imageUrl]);

    return(
        <>
            <Container>

                <Row>
                    <h1
                        style={{
                            marginLeft:'2%'
                        }}
                    >
                        {match.params.snakename}
                    </h1>
                    {showImage.length > 0 && imageDownloadProgress === 100 &&
                        <Button 
                            variant='success'
                            style={{
                                marginLeft:'2%',
                                padding:'5px',
                                height:'80%',
                                marginTop:'1%'
                            }}
                            onClick={downloadImage}
                        >
                            download image
                            <img 
                                style={{
                                    height:'20px',
                                    width:'20px',
                                    marginLeft:'5px',
                                    marginBottom:'5px'
                                }}
                                src={process.env.PUBLIC_URL + '/download_icon.png'}
                                alt="..."
                            />
                        </Button>
                    }
                    {imageDownloadProgress !==100 &&
                        <div
                            style={{
                                marginTop:'2%',
                                marginLeft:'2%'
                            }}
                        >
                            downloading...
                        </div>
                    }
                   
                </Row>

                {imageDownloadProgress !== 100 &&
                    <ProgressBar striped variant="primary" label={'downloading... ' + imageDownloadProgress + '%'} now={imageDownloadProgress} />
                }
                

                <Nav variant="tabs" defaultActiveKey="link-1">
                    <Nav.Item>
                        <Nav.Link eventKey="link-1" part="fullBody" onClick={handleSnakePartClicked}>เต็มตัว</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-2" part="head" onClick={handleSnakePartClicked}>หัว</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-3" part="bodyPart" onClick={handleSnakePartClicked}>ลำตัว</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-4" part="tail" onClick={handleSnakePartClicked}>หาง</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Row className="justify-content-center">
                    {
                        showImage.map((item, index)=>
                            <Col key={index} className="mt-5 mx-4" lg={3} md={4} sm={6} xs={12}>
                                <Card className="shadow-lg bg-white rounded" style={{width:'18rem'}}>
                                    <Card.Img style={{width:'18rem',height:'15rem'}} variant="top" src={item.url}/>
                                    <Card.Body>
                                        <Button 
                                            variant="danger" 
                                            onClick={handleModalShow}
                                            index={index}
                                            style={{
                                                width:'60%',
                                                marginLeft:'20%',
                                                marginRight:'20%'
                                            }}
                                        >
                                            x ลบรูปภาพ
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
                {!fullLoad &&
                    <> 
                        <Row>
                            <Spinner 
                                animation="border" 
                                variant="primary"
                                style={{
                                    height:'25rem',
                                    width:'25rem',
                                    marginTop:'100px',
                                    marginLeft:'auto',
                                    marginRight:'auto',
                                    borderWidth:'2rem'
                                }} 
                            />
                        </Row>
                        
                        <Row>
                            <div
                                style={{
                                    marginLeft:'auto',
                                    marginRight:'auto',
                                    marginTop:'25px',
                                    fontSize:'40px'
                                }}
                            >
                                Loading...
                            </div>
                        </Row>
                    </>
                }
                
            </Container>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>ลบรูปภาพ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ต้องการลบรูปภาพจริงหรือไม่ ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDeleteImage}>
                        ลบ
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SnakeCustom