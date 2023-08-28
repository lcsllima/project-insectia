import React from "react";
import './SiteFooter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const SiteFooter = (props) => {
    return (
    <footer class="footer">
        <div class="contaicompanyner">
            <div class="row">
                <div class="footer-col">
                    <h4>Quem somos</h4>
                    <ul>
                        <li><a href="#">Sobre nós</a></li>
                        <li><a href="#">Politicas de privacidade</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Dúvidas:</h4>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Nos siga nas redes sociais</h4>
                    <div class="social-links">
                        <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                        <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                        <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    );
}

export default SiteFooter;