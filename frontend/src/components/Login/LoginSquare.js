import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/LoginSquare.css';
import AuthService from "../../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">
        This field is required!
      </div>
    );
  }
};

const LoginSquare = (props) => {
  const navigate = useNavigate();
  const form = useRef();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register!");
    setMessage("");

    AuthService.register(email, password).then(
      (res) => {
        console.log(res['data']);
        setMessage(res['data']);
        if (res === 200) {
          window.location.reload();
        }
        if (res === 401) {
          setMessage("Member Already Exist");
        }
        if (res === 402) {
          setMessage("Member not Exist");
        }
        if (res === 402) {
          setMessage("Wrong Password");
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
  };

  useEffect(() => {
  }, [email, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login!");
    setMessage("");
    // setLoading(true);


    AuthService.login(email, password).then(
      (res) => {
        // navigate("/profile");
        // window.location.reload();
        // console.log(email, password);
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

        setLoading(false);
        setMessage(resMessage);
      }
    );
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
          validations={[required]}
        />
        <input
          type="password"
          className="input"
          placeholder="密碼"
          name="password"
          value={password}
          onChange={onChangePassword}
          validations={[required]}
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

