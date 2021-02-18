import React from 'react'
import axios from 'axios'
import firebase from '../firebase'
import {saveAs} from 'file-saver'
import jszip from 'jszip'

function getzip(e){
    const storageRef = firebase.storage().ref()
    storageRef.child('testimage/งูจงอาง/fullBody/15.jpg').getDownloadURL()
    .then((url)=>{
        //console.log(url)
        const config = { responseType: 'blob' }
        axios.get(url, config).then(response => {
            let file = new File([response.data], 'test.jpg')
            const zip = jszip()
            zip.file('test.jpg', file, {blob:true})
            zip.file('test2.jpg', file, {blob:true})
            zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, "testzip.zip");
            });       
        }).catch((error)=>{
            console.log(error)
            throw error
        })
    })
    .catch((error)=>{
        console.log(error)
        throw error
    })
}

function loadImage(){
    return(
    <>
    <button onClick={getzip}>click</button>
    </>
    )
}

export default loadImage