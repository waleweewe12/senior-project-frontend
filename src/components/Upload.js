import React from 'react';
import Model from './Model';
import AddImage from './AddImage';
import Threshold from './Threshold';
import Weight from './Weight';

function Upload(){
    return(
        <>
            <AddImage />
            <Model />
            <Threshold />
            <Weight />
        </>
    )
}

export default Upload;