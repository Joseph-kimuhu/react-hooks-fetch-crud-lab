import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questions.");
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleAddQuestion(newQuestion) {
    setQuestions((prev) => [...prev, newQuestion]);
  }

  function handleDeleteQuestion(id) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function handleUpdateQuestion(updatedQuestion) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  }

  const sortedQuestions = [...questions].sort((a, b) => a.id - b.id);

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : loading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <QuestionList
          questions={sortedQuestions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;



