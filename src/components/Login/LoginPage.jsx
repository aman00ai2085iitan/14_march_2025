import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import logo2 from "../../assets/images/logo3.jpg";

function LoginPage() {
  const [activeTab, setActiveTab] = useState("Email");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  const handleTabClick = (tab) => setActiveTab(tab);

  const startTimer = () => {
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    console.log("OTP resent!");
    startTimer();
  };

  const handleOtpChange = (value, index) => {
    if (!isNaN(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.every((digit) => digit)) {
      console.log("Form submitted with", { emailOrPhone, otp });
      navigate("/train");
    } else {
      alert("Please fill in all OTP digits before submitting.");
    }
  };

  return (
    <div className="login-page">
      {/* Top Oval */}
      <div className="oval-container-top"></div>

      {/* Login Form */}
      <div className="login-container">
        <img src={logo2} alt="Logo" className="logo" />
        <h2>Sign in to your account</h2>
        <p>Verify your identity to continue</p>
        <div className="tabs">
          <button
            className={activeTab === "Email" ? "active" : ""}
            onClick={() => handleTabClick("Email")}
          >
            Email
          </button>
          <button
            className={activeTab === "Phone Number" ? "active" : ""}
            onClick={() => handleTabClick("Phone Number")}
          >
            Phone Number
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
          className="email-input"
            type={activeTab === "Email" ? "email" : "tel"}
            placeholder={
              activeTab === "Email" ? "Enter your email" : "Enter your phone"
            }
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
          <button type="button" onClick={startTimer} className="get-otp-button">
            Get OTP
          </button>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digit && index > 0) {
                    document.getElementById(`otp-${index - 1}`).focus();
                  }
                }}
              />
            ))}
          </div>
          <p className="resend-otp">
          Didn't receive OTP? 
            {timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="resend-button"
              >
                Resend OTP
              </button>
            )}
          </p>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="footer-links">
          <Link to="#">Having trouble?</Link>
          <Link to="#">Login with password</Link>
        </div>
        <p className="terms">
          By continuing, you agree to our <Link to="#">Terms of Service</Link>{" "}
          and <Link to="#">Privacy Policy</Link>.
        </p>
      </div>

      {/* Bottom Oval */}
      <div className="oval-container-bottom"></div>
    </div>
  );
}

export default LoginPage;
