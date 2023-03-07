import SuccessSquare from "./SuccessSquare";

import { useNavigate } from "react-router-dom";
import AlreadyLoginHeader from "../AlreadyLoginHeader"
import "./css/SuccessPage.css"
function SuccessPage() {
  const navigate = useNavigate()
  return (
    <div>

      <AlreadyLoginHeader/>
      <div
      style={{
        display:'flex',
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'column',
        position: 'relative',
        top: '50%',
        transform: 'translate(0%, 10%)',
        gap:'2rem'
        }}>
          {/* 進度條 */}
          <div style={{
            width: '674px',
            height: '40px',
            left: '299px',
            top: '90px'
        }}></div>
        <SuccessSquare />
      
        <button className="next_button" onClick={() =>navigate('/Choose')}>
            <span>確定</span>
        </button>
  
      </div>
    </div>
  );
}

export default SuccessPage;
