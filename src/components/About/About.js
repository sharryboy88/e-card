import React from 'react';

import classes from './About.module.scss';

import Container from '../Container/Container';

const About = () => (
    <Container>
        <div className={classes.about}>
            <h2 className={classes.heading__primary}>About Me</h2>
            <div className={classes.about__presentation}>I am sharryboy, a guy who likes Kaiji and wanted to try coding.</div>
            <div className={classes.about__circles}>
                <a href='https://discord.gg/Jaqueswebster' target="_blank" rel="noopener noreferrer" className={classes.about__circle}>Discord</a>
                <a href='https://github.com/sharryboy88/e-card-v2' target="_blank" rel="noopener noreferrer" className={classes.about__circle}>Website</a>
            </div>
        
        </div>
    </Container>
)

export default About;
