import React from 'react'
import Notfound from "../assets/404.jpg"
import styles from "../styles/NotFound.module.css"
import appStyles from '../App.module.css'
import btnStyles from '../styles/Button.module.css'
import Asset from './Asset'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const NotFound = () => {
    const history = useHistory();

    return (
        <div className={styles.ImageContainer}>
            <Asset src={Notfound} message="We're sorry, this page doesn't exist!" />
            <div className={appStyles.TextCenter}>
                <Button 
                    className={btnStyles.Button}
                    onClick={() => history.goBack()}
                >
                    Go back!
                </Button>
            </div>
            <div className={`${appStyles.TextCenter} pt-4`}>
                <a href="http://www.freepik.com">Designed by stories / Freepik</a>
            </div>
        </div>
    )
}

export default NotFound