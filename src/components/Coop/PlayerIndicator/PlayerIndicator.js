import React from 'react';
import classes from './PlayerIndicator.module.scss';

const PlayerIndicator = ({ playerNumber, isActive }) => (
    <div className={classes.indicator}>
        <div 
            className={`${classes.playerBadge} ${isActive ? classes.active : ''}`}
            style={{ 
                backgroundColor: playerNumber === 1 ? '#4A90E255' : '#E84A5F55',
                borderColor: playerNumber === 1 ? '#4A90E2' : '#E84A5F'
            }}
        >
            Player {playerNumber}
            {isActive && <div className={classes.glow} />}
        </div>
    </div>
);

export default PlayerIndicator;