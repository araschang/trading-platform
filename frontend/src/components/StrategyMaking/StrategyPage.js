import InfoSquare from "./StrategySquare";
import { useNavigate } from "react-router-dom";
import AlreadyLoginHeader from "../AlreadyLoginHeader";
import "./css/StrategyPage.css";
import MultiStepProgressBar from './TwoProgressBar';

function StrategyPage() {
  const navigate = useNavigate()
  return (
    <div>

      <AlreadyLoginHeader />
      {/* 進度條 */}
      <div style={{
        position: 'absolute',
        width: '674px',
        height: '61px',
        left: '23%',
        top: '15%'
      }}><MultiStepProgressBar /></div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'absolute',
          top: '85%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>

        <InfoSquare />


      </div>
    </div>
  );
}

export default StrategyPage;
