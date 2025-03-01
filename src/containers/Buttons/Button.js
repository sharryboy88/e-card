// src/containers/Buttons/Button.js
import React from 'react';
import './Buttons.scss';
import { Link } from 'react-router-dom';

const Button = ({
    text,
    href,
    btnClass,
    animated,
    isDisabled,
    clicked,
    playerNumber
}) => {
    const getPlayerColor = () => {
        if (!playerNumber) return '#FFFFFF';
        return playerNumber === 1 ? '#4A90E2' : '#E84A5F';
    }

    if(href){
        return(
            <Link to={href} className={`button ${btnClass} ${animated ? 'button__animated': ''}`}>
                {text}
            </Link>
        );
    }

    return(
        <button 
            disabled={isDisabled}
            className={`button ${btnClass} ${animated ? 'button__animated': ''} ${isDisabled ? 'button__disabled' : ''}`}
            onClick={clicked}
            style={{
                border: `2px solid ${getPlayerColor()}`,
                boxShadow: `0 0 15px ${getPlayerColor()}80`
            }}
        >
            <span style={{ color: getPlayerColor() }}>
                {text}
            </span>
        </button>
    );
}

export default Button;