import React from "react";
import './SiteHeaders.css';

const SiteHeaders = (props) => {
    return (
        <div className="site-header">
            <div className="header-nav-bar">
                <h1>{props.title}</h1>
                <div className="site-search">
                    <input id="main-search" type="text" placeholder="Pesquisar" />
                </div>
            </div>
        </div>
    );
}

export default SiteHeaders;