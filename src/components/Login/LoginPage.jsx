import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import axios from "axios";
import logo2 from "../../assets/images/logo3.jpg";

function LoginPage() {
  const [activeTab, setActiveTab] = useState("Email");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tab) => setActiveTab(tab);

  const startTimer = () => {
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("https://smartcoachez.com/rail/public/api/login", {
        identifier: emailOrPhone,
      });

      toast.success("OTP Sent! Please check your email or phone.", {
        position: "top-right",
        autoClose: 2000,
      });

      startTimer();
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to Send OTP. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("https://smartcoachez.com/rail/public/api/verify-otp", {
        identifier: emailOrPhone,
        otp: otp.join(""),
      });

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login Successful! Redirecting to train page...", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/train");
        }, 2000);
      } else {
        toast.error("Invalid OTP. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      toast.error("OTP Verification Failed. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!isNaN(value) && value !== "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move focus to the next input if the current input is filled
      if (index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    } else if (value === "" && index > 0) {
      // Move focus back to the previous input if the current input is cleared
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="login-page">
      <div className="oval-container-top"></div>
      <div className="login-container">
        <img src={logo2} alt="Logo" className="logo" />
        <h2>Sign in to your account</h2>
        <p>Verify your identity to continue</p>
        <div className="tabs">
          <button className={activeTab === "Email" ? "active" : ""} onClick={() => handleTabClick("Email")}>
            Email
          </button>
          <button className={activeTab === "Phone Number" ? "active" : ""} onClick={() => handleTabClick("Phone Number")}>
            Phone Number
          </button>
        </div>
        <form onSubmit={verifyOtp}>
          <input
            className="email-input"
            type={activeTab === "Email" ? "email" : "tel"}
            placeholder={activeTab === "Email" ? "Enter your email" : "Enter your phone"}
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
          <button type="button" onClick={sendOtp} className="get-otp-button" disabled={loading}>
            {loading ? "Sending..." : "Get OTP"}
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
              />
            ))}
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
      <div className="oval-container-bottom"></div>
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
}

export default LoginPage;