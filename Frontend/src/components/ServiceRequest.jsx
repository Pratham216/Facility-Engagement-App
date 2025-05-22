import React, { useState } from "react";

function ServiceRequest() {
  const [serviceType, setServiceType] = useState("cleaning");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!location.trim()) {
        throw new Error("Location is required");
      }
      if (!description.trim()) {
        throw new Error("Description is required");
      }

      // Prepare the request data
      const requestData = {
        serviceType,
        location: location.trim(),
        description: description.trim()
      };

      console.log("Submitting service request:", requestData);

      // Send to backend
      const response = await fetch("http://localhost:5000/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit service request");
      }

      const result = await response.json();
      console.log("Service request submission successful:", result);

      // Reset form and show success
      setSubmitted(true);
      setServiceType("cleaning");
      setLocation("");
      setDescription("");
    } catch (err) {
      console.error("Service request submission error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitted(false);
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="service-request">
      <h2>Request Facility Services</h2>
      <p>Report issues or request services in real-time.</p>

      {error && <div className="error-message">{error}</div>}
      {submitted ? (
        <div className="success-message">Your request has been submitted!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="serviceType">Service Type:</label>
            <select
              id="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="security">Security</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Building/Room number"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="5"
              disabled={isSubmitting}
              placeholder="Please describe the issue or service needed in detail"
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}

      <style>{`
        .service-request {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        select, input, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        textarea {
          resize: vertical;
        }
        button {
          background-color: #2196F3;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .success-message {
          color: #4CAF50;
          padding: 10px;
          background-color: #e8f5e9;
          border-radius: 4px;
          margin: 10px 0;
        }
        .error-message {
          color: #f44336;
          padding: 10px;
          background-color: #ffebee;
          border-radius: 4px;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}

export default ServiceRequest;