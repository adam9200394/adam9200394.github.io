import { useEffect } from 'react';
import menu from '../assets/menu.png';

function Header () {
    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        }
    });

    const isSticky = (e) => {
         const header = document.querySelector('.header');
         const scrollTop = window.scrollY;
         scrollTop >= 250 ? header.classList.add('is-sticky') : header.classList.remove('is-sticky')
    }
    return (
        <div className="header">
          
                <div className="header-title">
                    <h1> Protofilo </h1>
                </div>
            
                <div className="header-menu">
                <menu>
                    <ul>
                        <li><a href='#ourwork'>our work </a></li>
                        <li> <a href='#contact us'>contact us </a></li>
                    </ul>
                </menu>
                </div>
          

        </div>
    )
}

export default Header;
