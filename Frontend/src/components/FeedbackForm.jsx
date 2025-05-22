import React, { useState } from "react";

function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate input
      if (!feedback.trim()) {
        throw new Error("Feedback cannot be empty");
      }

      const ratingNumber = Number(rating);
      if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 10) {
        throw new Error("Rating must be between 1 and 10");
      }

      // Prepare the data for submission
      const feedbackData = {
        feedback: feedback.trim(),
        rating: ratingNumber
      };

      console.log("Submitting feedback:", feedbackData);

      // Send to backend
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit feedback");
      }

      const result = await response.json();
      console.log("Feedback submission successful:", result);

      setSubmitted(true);
      setFeedback("");
      setRating(5);
    } catch (err) {
      console.error("Feedback submission error:", err);
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
    <div className="feedback-form">
      <h2>Real-Time Facility Feedback</h2>
      <p>Help us improve our services by sharing your experience.</p>

      {error && <div className="error-message">{error}</div>}
      {submitted ? (
        <div className="success-message">Thank you for your feedback!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <div className="rating-input">
              <input
                type="range"
                id="rating"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <span className="rating-value">{rating}/10</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="feedback">Your Feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              rows="5"
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}

      <style>{`
        .feedback-form {
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
        textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
        }
        .rating-input {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rating-value {
          min-width: 30px;
          text-align: center;
        }
        button {
          background-color: #4CAF50;
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

export default FeedbackForm;