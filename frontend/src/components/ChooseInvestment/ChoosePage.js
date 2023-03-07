import ChooseSquare from "./ChooseSquare";

import { useNavigate } from "react-router-dom";
import AlreadyLoginHeader from "../AlreadyLoginHeader"
import "./css/ChoosePage.css"
import OneProgressBar from './OneProgressBar'
function ChoosePage() {
  const navigate = useNavigate()
  return (
    <div>
      
      <AlreadyLoginHeader/>
      {/* 進度條 */}
          <div style={{
            position:'absolute',
            width: '674px',
            height: '61px',
            left: '23%',
            top: '15%'
        }}><OneProgressBar/></div>
      <div
      style={{
        display:'flex',
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'column',
        position: 'absolute',
        top: '60%',
        left:'50%',
        transform: 'translate(-50%, -50%)',
        }}>
          
        <ChooseSquare />
      
     
      <button className="choose_next_button" style={{top:'10%'}}onClick={() =>navigate('/Strategy')}>
          <span>下一步</span>
      </button>
      
      </div>
      </div>
  );
}

export default ChoosePage;
