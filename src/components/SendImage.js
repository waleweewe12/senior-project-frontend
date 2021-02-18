import React, {useState} from 'react'
import axios from 'axios'
import firebase from '../firebase'

function SendImage(){

    const [images, setImages] = useState(null);

    const handleImageChanged = (e)=>{
        console.log('image changed');
        setImages(e.target.files);
    }

    const sendImage = async (e)=>{
        console.log('clicked');
        e.preventDefault();
        const formData = new FormData();
        for(const image of images){
            formData.append('userImage', image);
        }
        // let url = 'https://venomoussnake-303614.et.r.appspot.com/upload';
        let url = 'http://localhost:8080/upload';
        try {
            let predictedResponse = await axios.post(url, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(predictedResponse.data);
            //save information in database
            // let timeStamp = new Date().getTime();
            // const storageRef = firebase.storage().ref('userImage/' + timeStamp + '.jpg');
            // await storageRef.put(image);
            // console.log('upload success');
            // let imageUrl = await storageRef.getDownloadURL();
            // let data = {
            //     section:'tail',
            //     predicted:predictedResponse.data,
            //     dateTime:timeStamp,
            //     imageUrl
            // }
            // await axios.post('http://localhost:5000/venomous-snake/us-central1/app/result/addResult', data);
            // console.log('save data success');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const sendBlobImage = async (e)=>{
        e.preventDefault();
        let url = "https://firebasestorage.googleapis.com/v0/b/venomous-snake.appspot.com/o/testimage%2F%E0%B8%87%E0%B8%B9%E0%B8%88%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%87%2FfullBody%2F8.jpg?alt=media&token=72fa7904-6cc0-4054-b14e-8a40c02921f4";
        try {
            let response = await fetch(url);
            let blob = await response.blob();
            const formData = new FormData();
            formData.append('userImage', blob, 'snakeExample');
            let apiPath = 'https://venomoussnake-303614.et.r.appspot.com/upload';
            let predictedResponse = await axios.post(apiPath, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(predictedResponse.data);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return(
        <div>
            <form>
                <input type="file" multiple onChange={handleImageChanged} />
                <button onClick={sendImage}>send image</button>
                {/* <button onClick={sendBlobImage}>test send blob image</button> */}
            </form>
        </div>
    )
}

export default SendImage;