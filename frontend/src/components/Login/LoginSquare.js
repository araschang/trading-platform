import React, { useState, useRef } from "react";
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
  const { setCurrentPage } = props;
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
    setMessage("");
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
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);


    AuthService.login(email, password).then(
      (res) => {
        // navigate("/profile");
        // window.location.reload();
        // console.log(email, password);
        // console.log(res);

        setMessage(res);
        if (res === 200) {
          navigate('/Choose', { state: { email: email } });
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
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Login</span>
          </button>
        </form>
        <form ref={form} onSubmit={handleRegister}> {/*註冊*/}
          <button className="register_button" disabled={loading}>
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Register</span>
          </button>
        </form>
        {message && (
          <div className="center alert-danger" role="alert">
            {message}
          </div>
        )}
      </div>

    </div>
  );
};

export default LoginSquare;

