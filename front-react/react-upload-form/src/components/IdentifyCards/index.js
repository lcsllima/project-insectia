import React from "react";
import './IdentifyCards.css'


const IdentifyCards = (props) => {
    return (
        <div className="wrapper-content-div">
            <div className="card">
                <div className="card-header">
                    <h1>{props.title}</h1>
                </div>
                <div className="card-image">
                    <img src={props.image} alt={props.alt} />
                </div>
            </div>
        </div>
    );
};

export default IdentifyCards;