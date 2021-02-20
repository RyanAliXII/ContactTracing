import React,{useEffect,useState} from 'react';
import '../Assets/home.css'
import mobile from '../Assets/images/mobile.svg'
import Reading from '../Assets/images/Reading.svg'
import {Link} from 'react-router-dom'

function Home(props) {

    const [isMobileView, setMobileView] = useState(true);

    useEffect(() => {

        function resizeFunction(){
           
            if(window.innerWidth >= 810){
                setMobileView(false)
            }
            else{
                setMobileView(true)
            }
        }
        window.addEventListener('resize',resizeFunction)
        return ()=>{
            window.removeEventListener('resize',resizeFunction)
        }
    },[])
    return (
        <>
        <header className="home-header">
                <span className="blue-clr">Campus</span>
            </header>
        <div className="home">
            <div className="section-1">
            <div className="section-wrapper">
            <div className="home-texts">
            <div className="home-title">
              <span className="yl-clr">Welcome! Student</span>
            </div>
            <div className="home-subtitle">
              <span className="blue-clr">You can now easily access school facilities using this web application. We monitor your movement in school campus to make sure you are safe and informed.</span>
            </div>
            </div>
           
            <div className="CTA">
                <Link to="/signin" className="blue-bg default-clr">Sign In </Link>
                <Link to="signup" className="cta-border blue-clr">Sign Up</Link>
            </div>
            </div>
            </div>
            <div className="section-2">

                {isMobileView && window.innerWidth < 810 ? (
                <img src={mobile} alt="background"></img>):(
                <img src={Reading} alt="person" className="illustration" ></img>)
                 }
            </div>
        </div>
        </>
    );
}

export default Home;