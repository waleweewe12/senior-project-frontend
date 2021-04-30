import React, {useState} from 'react';
import { 
    Button,
    ProgressBar,
    Col
} from 'react-bootstrap';
import firebase from '../firebase';
import jszip from 'jszip';
import axios from 'axios';
import { saveAs } from 'file-saver'

function DownloadBar(){

    const [downloadProgress, setDownloadProgress] = useState(100); 

    const downloadImage = async (part) => {
        const config = { responseType: 'blob' };
        const zip = jszip();
        const db = firebase.firestore();
        let result = await db.collection('images').where('bodypart', '==', part)
        .get();
        let imageData = [];
        result.forEach((snapShot)=>{
            imageData.push({
                url:snapShot.data().imageUrl,
                snakeType:snapShot.data().snakeType,
            });
        });
        try {
            //start downloadpregress
            setDownloadProgress(0);
            //load image from storage
            for(let i = 0; i < imageData.length; i++){
                let response = await axios.get(imageData[i].url, config);
                let file = new File([response.data], 'snake.jpg');
                zip.folder(imageData[i].snakeType)
                    .file(imageData[i].snakeType + '_' + part + '_' + (i + 1) + '.jpg', file, {blob:true});
                let progress = (i + 1) / imageData.length * 100;
                //update progressbar
                setDownloadProgress(parseInt(progress));
            }
            //zip image
            let content = await zip.generateAsync({type:"blob"});
            //download zip to own device
            saveAs(content, 'AllSnake_' + part + '.zip');
            //end download progress
            setDownloadProgress(100);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return(
    <>
        <Col>
            {/* <Button variant="danger">รูปภาพทั้งหมด</Button>{' '} */}
            <Button variant="danger" onClick={() => {downloadImage("fullBody")}}>เต็มตัว</Button>{' '}
            <Button variant="secondary" onClick={() => {downloadImage("head")}}>หัว</Button>{' '}
            <Button variant="success" onClick={() => {downloadImage("mid")}}>ลาย</Button>{' '}
            <Button variant="warning" onClick={() => {downloadImage("tail")}}>หาง</Button>{' '}
            {downloadProgress !== 100 &&
            <>
                <div
                    style={{
                        marginTop:'10px'
                    }}
                >   
                    download {downloadProgress} %
                </div>
                <ProgressBar now={downloadProgress} label={downloadProgress + '%'} />
            </>
            }
        </Col>
    </>
    )
}

export default DownloadBar;