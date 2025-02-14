import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./SignUp.css"; // Add your CSS for SignUpPage here.

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "User", // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload for the API
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
    };

    try {
      // Make the POST request to the Laravel API
      const response = await fetch("http://smartcoachez.com/rail/public/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const data = await response.json();
        console.log("User registered successfully:", data);

        // Show success toast using SweetAlert2
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Registration Successful!",
          text: "You have registered successfully. Please log in.",
          showConfirmButton: false,
          timer: 3000, // Toast disappears after 3 seconds
        }).then(() => {
          // Redirect to login page after success
          navigate("/login");
        });
      } else {
        // Handle errors if any
        const errorData = await response.json();
        console.error("Error during registration:", errorData);

        // Show error toast using SweetAlert2
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Registration Failed!",
          text: "Something went wrong. Please try again.",
          showConfirmButton: false,
          timer: 3000, // Toast disappears after 3 seconds
        });
      }
    } catch (error) {
      console.error("Network error:", error);

      // Show network error toast using SweetAlert2
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: "An error occurred while registering. Please try again.",
        showConfirmButton: false,
        timer: 3000, // Toast disappears after 3 seconds
      });
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Operator">Operator</option>
            <option value="User">User</option>
            <option value="Owner">Owner</option>
          </select>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="terms">
          By signing up, you agree to our <Link to="#">Terms of Service</Link>{" "}
          and <Link to="#">Privacy Policy</Link>.
        </p>
        <div className="footer-links">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
