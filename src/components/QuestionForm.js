import React, { useState, useEffect, useRef } from "react";

function QuestionForm({ onAddQuestion }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctIndex: 0,
  });

  const [success, setSuccess] = useState(false);
  const timeoutRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "correctIndex" ? parseInt(value) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Validation
    const { prompt, answer1, answer2, answer3, answer4 } = formData;
    if (!prompt || !answer1 || !answer2 || !answer3 || !answer4) {
      alert("Please fill out all fields.");
      return;
    }

    const newQuestion = {
      prompt,
      answers: [answer1, answer2, answer3, answer4],
      correctIndex: formData.correctIndex,
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted.current) return;

        onAddQuestion(data);
        setFormData({
          prompt: "",
          answer1: "",
          answer2: "",
          answer3: "",
          answer4: "",
          correctIndex: 0,
        });
        setSuccess(true);

        timeoutRef.current = setTimeout(() => {
          if (isMounted.current) setSuccess(false);
        }, 2000);
      });
  }

  return (
    <section>
      <h1>New Question</h1>
      {success && <p className="success-message">Question added successfully!</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 1:
          <input
            type="text"
            name="answer1"
            value={formData.answer1}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 2:
          <input
            type="text"
            name="answer2"
            value={formData.answer2}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 3:
          <input
            type="text"
            name="answer3"
            value={formData.answer3}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 4:
          <input
            type="text"
            name="answer4"
            value={formData.answer4}
            onChange={handleChange}
          />
        </label>
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            <option value="0">{formData.answer1 || "Answer 1"}</option>
            <option value="1">{formData.answer2 || "Answer 2"}</option>
            <option value="2">{formData.answer3 || "Answer 3"}</option>
            <option value="3">{formData.answer4 || "Answer 4"}</option>
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;


