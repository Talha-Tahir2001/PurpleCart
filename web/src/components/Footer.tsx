
import { assets } from '../assets/assets.js'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFacebook, faInstagram, faLinkedin, faTwitter, faGithub } from '@fontawesome/free-solid-svg-icons'
import {IconBrandFacebook, IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter} from '@tabler/icons-react'
function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full mt-18 py-10 bg-linear-to-b from-emerald-100/10 to-emerald-200">
        <div className="flex items-center ">
            <img className="hover:bg-emerald-100/40 p-2 rounded-2xl cursor-pointer" src={assets.logo} alt="logo" />
        </div>

        {/* Copyright */}
        <p className="mt-4 text-center text-gray-700"> Copyright © 2025{" "}
            <a href="#" className="underline hover:text-emerald-900"> GreenCart </a>
            . All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-6 mt-5 text-2xl">
            <a title="Facebook" href="#" className="hover:-translate-y-0.5 transition-all duration-300 text-blue-600" > <IconBrandFacebook /> </a>
            <a title="Instagram" href="#" className="hover:-translate-y-0.5 transition-all duration-300 text-purple-600" > <IconBrandInstagram /> </a>
            <a title="LinkedIn" href="#" className="hover:-translate-y-0.5 transition-all duration-300 text-blue-400" > <IconBrandLinkedin /> </a>
            <a title="Twitter" href="#" className="hover:-translate-y-0.5 transition-all duration-300 text-sky-500" > <IconBrandTwitter /> </a>
            <a title="GitHub" href="#" className="hover:-translate-y-0.5 transition-all duration-300 text-gray-700" > <IconBrandGithub /> </a>
        </div>
    </footer>
  );
}

export default Footer;