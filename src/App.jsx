import { useEffect, useState } from 'react'

const QuestionItem = ({
  question,
  number,
  updateQuestion,
  deleteQuestion,
  addChildQuestion,
}) => {
  return (
    <div
  style={{
  marginTop: '16px',
  marginLeft: '20px',
  padding: '20px',
  border: '1px solid #e5e7eb',
  borderRadius: '14px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}}
>
     <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
  Q{number}
</div>
      <input
        type="text"
        placeholder="Enter question"
        value={question.text}
        onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
      />

      <select
        value={question.type}
        onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
        style={{ marginLeft: '10px' }}
      >
        <option value="short">Short Answer</option>
        <option value="boolean">True/False</option>
      </select>

      {question.type === 'boolean' && (
        <select
          value={question.answer}
          onChange={(e) => updateQuestion(question.id, 'answer', e.target.value)}
          style={{
  marginLeft: '10px',
  padding: '6px 10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  cursor: 'pointer',
}}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </select>
      )}

      {question.type === 'boolean' && question.answer === 'true' && (
        <button
          onClick={() => addChildQuestion(question.id)}
         style={{
  marginLeft: '10px',
  padding: '6px 10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  cursor: 'pointer',
}}
        >
          Add Child Question
        </button>
      )}

      <button
        onClick={() => deleteQuestion(question.id)}
        style={{ marginLeft: '10px' }}
      >
        Delete
      </button>

      <div>
        {question.children &&
          question.children.map((child, index) => (
            <QuestionItem
              key={child.id}
              question={child}
              number={`${number}.${index + 1}`}
              updateQuestion={updateQuestion}
              deleteQuestion={deleteQuestion}
              addChildQuestion={addChildQuestion}
            />
          ))}
      </div>
    </div>
  )
}

function App() {
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem('questions')
    return savedQuestions ? JSON.parse(savedQuestions) : []
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions))
  }, [questions])

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: '',
        type: 'short',
        answer: 'false',
        children: [],
      },
    ])
  }

  const updateQuestionRecursive = (items, id, field, value) => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value }
      }

      return {
        ...item,
        children: updateQuestionRecursive(item.children || [], id, field, value),
      }
    })
  }

  const deleteQuestionRecursive = (items, id) => {
    return items
      .filter((item) => item.id !== id)
      .map((item) => ({
        ...item,
        children: deleteQuestionRecursive(item.children || [], id),
      }))
  }

  const addChildQuestionRecursive = (items, id) => {
    return items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          children: [
            ...(item.children || []),
            {
              id: Date.now(),
              text: '',
              type: 'short',
              answer: 'false',
              children: [],
            },
          ],
        }
      }

      return {
        ...item,
        children: addChildQuestionRecursive(item.children || [], id),
      }
    })
  }

  const updateQuestion = (id, field, value) => {
    setQuestions((prev) => updateQuestionRecursive(prev, id, field, value))
  }

  const deleteQuestion = (id) => {
    setQuestions((prev) => deleteQuestionRecursive(prev, id))
  }

  const addChildQuestion = (id) => {
    setQuestions((prev) => addChildQuestionRecursive(prev, id))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const renderSubmittedQuestions = (items) => {
    return items.map((item) => (
      <div key={item.id} style={{ marginLeft: '20px', marginTop: '10px' }}>
        <p>
          <strong>Question:</strong> {item.text}
        </p>

        <p>
          <strong>Type:</strong> {item.type}
        </p>

        {item.children && item.children.length > 0 && renderSubmittedQuestions(item.children)}
      </div>
    ))
  }

  return (
  <div
    style={{
      minHeight: '100vh',
      padding: '40px 20px',
      background: '#f4f7fb',
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      }}
    >
      <h1>Nested Form Assignment</h1>

     <button
  onClick={addQuestion}
  style={{
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: 'white',
    cursor: 'pointer',
    marginRight: '10px',
  }}
>
  Add New Question
</button>

      <button
  onClick={handleSubmit}
  style={{
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#16a34a',
    color: 'white',
    cursor: 'pointer',
  }}
>
  Submit Form
</button>

      {submitted && (
        <div>
          <h2>Form Submitted</h2>
          {renderSubmittedQuestions(questions)}
        </div>
      )}

            <div style={{ marginTop: '20px' }}>
        {questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            number={index + 1}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
            addChildQuestion={addChildQuestion}
          />
        ))}
      </div>
    </div>
  </div>
)
}

export default App