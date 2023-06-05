import React from 'react'
import NoResults from "../assets/noresultsfound.jpeg"
import styles from "../styles/NotFound.module.css"
import Asset from './Asset'

const NotFound = () => {
  return (
    <div>
        <Asset src={NoResults} message="We're sorry, this page doesn't exist!" />
    </div>
  )
}

export default NotFound