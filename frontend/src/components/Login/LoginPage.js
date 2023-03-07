import Header from "./Header";
import LoginSquare from "./LoginSquare";


const LoginPage=()=> {
 
  return (
    <div>
      <Header/>
      <div
      style={{
        display:'flex',
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'column',
        position: 'absolute',
        top: '55%',
        left:'50%',
        transform: 'translate(-50%, -50%)',
        }}>
        <LoginSquare />
      </div>
      
    </div>
  );
}

export default LoginPage;
