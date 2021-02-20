import React from 'react';
import notFound from '../Assets/images/notFound.svg'
function NotFound(props) {
    return (
        <div className="notfound">
        <div className="notfound-wrapper">
            <img src={notFound} alt="notfound"></img>
            <span>PAGE NOT FOUND</span>
        </div>
        </div>
    );
}

export default NotFound;