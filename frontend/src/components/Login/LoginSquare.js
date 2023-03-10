import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/LoginSquare.css';
import AuthService from "../../services/auth.service";

const LoginSquare = (props) => {
  const navigate = useNavigate();
  const form = useRef();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const validateForm = () => {
    if (email.trim() === "" || password.trim() === "") {
      alert('請輸入電子郵件和密碼');
      return false;
    }
    return true;
  }

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  function checkStraInput() {
    const checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
    if (checkedBoxes.length === 0) {
      alert('請至少選擇一個策略');
      return false;
    }
    return true;
  }

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
<<<<<<< HEAD
    if (validateForm()) {
      AuthService.register(email, password).then(
        (res) => {
          console.log(res['data']);
          // setMessage(res['data']);
          if (res['data'] === 200) {
            setMessage("Register Success!");
            window.location.reload();
          }
          if (res['data'] === 401) {
            setMessage("Member Already Exist");
          }
          if (res['data'] === 402) {
            setMessage("Member not Exist");
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);

        }
      );
    }
=======
    AuthService.register(email, password).then(
      (res) => {
        console.log(res['data']);
        setMessage(res['data']);
        if (res === 200) {
          window.location.reload('/Choose');
        }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);

      }
    );
>>>>>>> main
  };

  useEffect(() => {
  }, [email, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    // setLoading(true);
    if (validateForm()) {
      AuthService.login(email, password).then(
        (res) => {
          // navigate("/profile");
          // window.location.reload();
          console.log(email, password);
          // console.log(res);

          if (res === 200) {
            navigate('/Choose', {
              state: {
                email: email,
              }
            });
          }
          if (res === 401) {
            setMessage("Member Already Exist");
          }
          if (res === 402) {
            setMessage("Member not Exist");
          }
          if (res === 403) {
            setMessage("Wrong Password");
          }
          if (res === 200) {
            navigate('/Choose');
          }
          // else {
          //   window.location.reload();
          // }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

<<<<<<< HEAD
          setLoading(false);
          setMessage(resMessage);
=======
    AuthService.login(email, password).then(
      (res) => {
        // navigate("/profile");
        // window.location.reload();
        // console.log(email, password);
        // console.log(res);

        setMessage(res);
        if (res === 200) {
          navigate('/Choose', { state: { email: email } });
>>>>>>> main
        }
      );
    }
  };

  return (
    <div className="account_square">

      <div className="account_title">會員登入</div>
      <div className="input_position">
        <input
          type="text"
          className="input"
          placeholder="電子郵件"
          name="email"
          value={email}
          onChange={onChangeEmail}
        />
        <input
          type="password"
          className="input"
          placeholder="密碼"
          name="password"
          value={password}
          onChange={onChangePassword}
        />
      </div>
      <div className="choose_button">
        <form ref={form} onSubmit={handleLogin}> {/*登入*/}
          <button className="login_button" disabled={loading}>
            {/* <button className="login_button" disabled={loading} onClick={() => navigate('/Choose')}> */}
            <span>Login</span>
          </button>
        </form>
        <form ref={form} onSubmit={handleRegister}> {/*註冊*/}
          <button className="register_button" disabled={loading}>
            <span>Register</span>
          </button>
        </form>

      </div>
      {message && (
        <div className="center str_title_text">
          {message}
        </div>
      )}
    </div>
  );
};

export default LoginSquare;

