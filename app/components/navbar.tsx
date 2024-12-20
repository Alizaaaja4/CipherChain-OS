import { useState } from 'react';
import PopGmail from './popGmail';

const Navbar = () => {
  // State untuk pop-up Gmail
  const [isGmailPopupOpen, setGmailPopupOpen] = useState(false);

  // Fungsi untuk membuka dan menutup pop-up Gmail
  const toggleGmailPopup = () => setGmailPopupOpen(!isGmailPopupOpen);

  return (
    <nav className="max-w-3xl mx-auto fixed bottom-4 w-full z-50 bg-transparent bg-opacity-40 shadow-lg shadow-black backdrop-blur-md rounded-xl">
      <div className="flex justify-center items-center px-4 py-2">
        
        {/* App logos */}
        <div className="flex items-center space-x-4">
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/google.png" // Assuming the image is in the 'public' folder
              alt="Google"
              className="h-10 w-10 rounded-md hover:translate-y-[-15px] transition-transform duration-300 hover:opacity-80"
            />
          </a>
          {/* VS Code */}
          <a href="#" rel="noopener noreferrer">
            <img
              src="/vscode.jfif" // Assuming the image is in the 'public' folder
              alt="VS Code"
              className="h-10 w-10 rounded-md hover:translate-y-[-15px] transition-transform duration-300 hover:opacity-80"
            />
          </a>
          {/* Wireshark */}
          <a href="#" rel="noopener noreferrer">
            <img
              src="/wireshark.jfif" // Assuming the image is in the 'public' folder
              alt="Wireshark"
              className="h-10 w-10 rounded-md hover:translate-y-[-15px] transition-transform duration-300 hover:opacity-80"
            />
          </a>
          {/* Gmail with Pop-up */}
          <a href="#" onClick={toggleGmailPopup} className="cursor-pointer">
            <img
              src="/gmail.jfif" // Assuming the image is in the 'public' folder
              alt="Gmail"
              className="h-10 w-10 rounded-md hover:translate-y-[-15px] transition-transform duration-300 hover:opacity-80"
            />
          </a>
          <a href="#" rel="noopener noreferrer">
            <img
              src="/gns3.png" // Assuming the image is in the 'public' folder
              alt="GNS3"
              className="h-10 w-10 rounded-md hover:translate-y-[-15px] transition-transform duration-300 hover:opacity-80"
            />
          </a>
          <a href="#" rel="noopener noreferrer">
            <img
              src="/laragon.jfif" // Assuming the image is in the 'public' folder
              alt="Laragon"
              className="h-10 w-10 rounded-md hover:translate-y-[-15px] transition-transform duration-300 hover:opacity-80"
            />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="/cisco.png" // Assuming the image is in the 'public' folder
              alt="Cisco"
              className="h-10 w-10 rounded-md hover:translate-y-[-15px] transition-transform duration-300 hover:opacity-80"
            />
          </a>
        </div>
      </div>

      {/* Panggil PopGmail dan kontrol visibilitasnya */}
      <PopGmail isOpen={isGmailPopupOpen} onClose={toggleGmailPopup} />
    </nav>
  );
};

export default Navbar;
