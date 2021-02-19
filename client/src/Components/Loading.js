import React from 'react';
import loading from '../Assets/images/loading.svg'

function Loading({Class}) {
    return (
        <div className={Class}>
            <img src={loading} alt="loading"></img>
        </div>
    );
}

export default Loading;