import React, { useEffect, useState } from 'react';

const DashResultEvaluation = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/exam/publish-list', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setExams(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching exams:', err);
        setLoading(false);
      });
  }, []);

  const togglePublish = async (examId, isCurrentlyPublished) => {
    try {
      const url = `/api/admin/${examId}/${isCurrentlyPublished ? 'unpublish' : 'publish'}`;
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
      });

      const result = await response.json();
      if (response.ok) {
        setExams(prev =>
          prev.map(exam =>
            exam._id === examId ? { ...exam, isPublished: !isCurrentlyPublished } : exam
          )
        );
        alert(result.message);
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Toggle publish error:', err);
      alert('Error toggling publish status');
    }
  };

  if (loading) return <p style={styles.loading}>Loading exams...</p>;
  if (exams.length === 0) return <p style={styles.loading}>No exams with submissions yet.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Exams Ready for Evaluation</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Year</th>
            <th style={styles.th}>Submissions</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam._id} style={styles.tr}>
              <td style={styles.td}>{exam.title}</td>
              <td style={styles.td}>{exam.department}</td>
              <td style={styles.td}>{exam.year}</td>
              <td style={styles.td}>{exam.studentCount}</td>
              <td style={styles.td}>
                <span
                  style={{
                    color: exam.isPublished ? '#27ae60' : '#c0392b',
                    fontWeight: 600,
                  }}
                >
                  {exam.isPublished ? 'Published' : 'Unpublished'}
                </span>
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => togglePublish(exam._id, exam.isPublished)}
                  style={{
                    ...styles.button,
                    backgroundColor: exam.isPublished ? '#e74c3c' : '#2ecc71',
                  }}
                >
                  {exam.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  loading: {
    padding: '30px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    fontSize: '15px',
    borderRadius: '6px',
  },
  tr: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    borderRadius: '8px',
    transition: 'transform 0.2s',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    color: '#34495e',
  },
  button: {
    padding: '8px 14px',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
};

export default DashResultEvaluation;
