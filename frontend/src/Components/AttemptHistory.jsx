import { useFetchAttempts } from "../hooks/useFetchAttempts";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

  return `${day}-${month}-${year} | ${formattedTime}`;
};

const AttemptHistory = () => {
  const { attempts, isLoading } = useFetchAttempts();

  if (isLoading) return <p>Loading your attempts...</p>;

  return (
    <div>
      <div>
        <h2>Your Attempt History</h2>
        {attempts.length === 0 ? (
          <p>No attempts yet. Start practicing!</p>
        ) : (
          <ul>
            {attempts.map((attempt) => (
              <li
                key={attempt._id}
                style={{ borderBottom: "1px solid #ddd", padding: "10px" }}
              >
                <h4>{attempt.questionId?.title || "Question Title"}</h4>
                <img
                  src={attempt.questionId.imageUrl}
                  alt="Attempt Image"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
                <p>
                  <strong>Result</strong> {attempt.isCorrect ? "✅" : "❌"}
                </p>
                <p>
                  <strong>Your Answer</strong> {attempt.userAnswer}
                </p>
                <p>
                  <strong> Correct Answer</strong> {attempt.questionId.correctAnswer}
                </p>
                <p>
                  <strong>Time Taken:</strong> {attempt.timeTaken} seconds
                </p>
                <p>
                  <strong>Attempted on:</strong>{" "}
                  {formatTimestamp(attempt.attemptedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AttemptHistory;
