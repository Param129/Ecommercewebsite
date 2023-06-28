import React from 'react'

import "./Footer.css";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png"

const footer = () => {
  return (
    <footer id='footer'>


        <div className="leftFooter">
            <h4>Download our APP</h4>
            <p>Download app for android and IOS mobile phones</p>
            <img src={playStore} alt="playStore" />
            <img src={appStore} alt="appStore" />
        </div>


        <div className="midFooter">
            <h1>JM</h1>
            <p>Customer is our first priority</p>
            <p>Copyrights 2023 &copy; ParamveerSingh</p>
        </div>


        <div className="rightFooter">
            <h4>Follow us</h4>
            <a href="https://www.instagram.com/paramtomar1212/">Instagram</a>
            <a href="https://www.instagram.com/paramtomar1212/">LinkedIn</a>
            <a href="https://www.instagram.com/paramtomar1212/">Facebook</a>
        </div>


    </footer>
  )
}

export default footer
