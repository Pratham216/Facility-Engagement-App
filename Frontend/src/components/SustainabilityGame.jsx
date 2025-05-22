import React, { useState } from "react";

function SustainabilityGame() {
  const [points, setPoints] = useState(0);
  const [activities, setActivities] = useState([
    { id: 1, name: "Used recycling bin", points: 10, completed: false },
    { id: 2, name: "Turned off unused lights", points: 5, completed: false },
    { id: 3, name: "Used stairs instead of elevator", points: 15, completed: false },
    { id: 4, name: "Reported water leak", points: 20, completed: false },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeActivity = async (id) => {
    const activity = activities.find((a) => a.id === id);
    if (!activity || activity.completed) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/game/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "demoUser", // <-- REQUIRED for backend, replace with real user if available
          points: activity.points,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to log activity");
      }

      setActivities((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, completed: true } : a
        )
      );
      setPoints((prev) => prev + activity.points);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sustainability-game">
      <h2>Sustainability Challenge</h2>
      <p>Earn points for sustainable behaviors and compete with others!</p>

      {/* {error && <div className="error-message">{error}</div>}
      {submitted && <div className="success-message">Activity logged successfully!</div>} */}

      <div className="points-display">
        <h3>Your Points: {points}</h3>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${Math.min(points, 100)}%` }}></div>
        </div>
      </div>

      <div className="activities">
        <h3>Available Activities:</h3>
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <button
                onClick={() => completeActivity(activity.id)}
                disabled={activity.completed || isSubmitting}
              >
                {activity.name} (+{activity.points} pts)
              </button>
              {activity.completed && <span className="completed">✓ Completed</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="leaderboard">
        <h3>Leaderboard</h3>
        <ol>
          <li>User123 - 150 pts</li>
          <li>EcoWarrior - 120 pts</li>
          <li>GreenTeam - 95 pts</li>
          <li>You - {points} pts</li>
        </ol>
      </div>

      <style>{`
        .sustainability-game {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #f0fdf4;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .points-display {
          margin-bottom: 20px;
        }
        .progress-bar {
          height: 10px;
          background-color: #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress {
          height: 10px;
          background-color: #4caf50;
          transition: width 0.3s ease-in-out;
        }
        .activities ul {
          list-style: none;
          padding: 0;
        }
        .activities li {
          margin-bottom: 10px;
        }
        button {
          padding: 8px 12px;
          font-size: 14px;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }
        .completed {
          margin-left: 10px;
          color: green;
        }
        .success-message {
          color: #2e7d32;
          background-color: #e8f5e9;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .error-message {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}

export default SustainabilityGame;
