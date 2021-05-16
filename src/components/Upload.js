import React from 'react';
import Model from './Model';
import AddImage from './AddImage';
import Threshold from './Threshold';

function Upload(){
    return(
        <>
            <AddImage />
            <Model />
            <Threshold />
        </>
    )
}

export default Upload;