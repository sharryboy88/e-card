import React, { Component } from 'react'
import classes from './Layout.module.scss';
import Popup from '../Popup/Popup';
import {withRouter} from 'react-router-dom'

class Layout extends Component {
    render() {
        return (
            <div className={classes.background}>
                {this.props.children}
            </div>
        )
    }
}

export default withRouter(Layout);