import React from "react";
import './FillerSpaceDiv.css'


const FillerSpaceDiv = (props) => {
    let divBody = "";


    if(props.title !== undefined && props.text !== undefined){
        divBody = <div className='wrapper-text'><h1>{props.title}</h1><p>{props.text}</p></div>;
    } else if(props.backgroundImage !== undefined){
        divBody = <div className={`wrapper-content-image background-img-${props.backgroundImage}`}></div>;
    } else {
        divBody = <div className='wrapper-text'></div>;
    }


    return (
        <div className="wrapper-content-div">
            <div className="info">
                {divBody}
            </div>
        </div>
    );
};

export default FillerSpaceDiv;