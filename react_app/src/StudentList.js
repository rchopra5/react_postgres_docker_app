import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import { Link } from 'react-router-dom';


function StudentList() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedStudentName, setEditedStudentName] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/students'); // Replace with your server URL
      const fetchedStudents = await response.json();
      setStudents(fetchedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleCreateStudent = async () => {
    if (newStudentName) {
      try {
        await fetch('http://localhost:3001/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newStudentName }),
        });
        setNewStudentName('');
        // Refresh the student list
        fetchStudents();
      } catch (error) {
        console.error('Error creating student:', error);
      }
    }
  };

  const handleEditStudent = (studentId) => {
    setEditingStudentId(studentId);
    const studentToEdit = students.find((student) => student.id === studentId);
    setEditedStudentName(studentToEdit.name);
  };

  const handleSaveEdit = async (studentId) => {
    try {
      await fetch(`http://localhost:3001/students/${studentId}?update=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedStudentName }), // Send editedStudentName to the server
      });
      setEditingStudentId(null);
      // Refresh the student list
      fetchStudents();
    } catch (error) {
      console.error('Error editing student:', error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await fetch(`http://localhost:3001/students/${studentId}`, {
        method: 'DELETE',
      });
      // Refresh the student list
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="StudentList">
      {/* Form to create a student */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateStudent();
        }}
      >
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="Enter student name"
        />
        <button type="submit">Create Student</button>
      </form>

      {/* List of students with edit, save, and delete buttons */}
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {editingStudentId === student.id ? (
              <>
                <input
                  type="text"
                  value={editedStudentName}
                  onChange={(e) => setEditedStudentName(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(student.id)}>Save</button>
                <button onClick={() => setEditingStudentId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {student.name}
                <button onClick={() => handleEditStudent(student.id)}>Edit</button>
                <Link to={`/view-classes/${student.id}`}> View Classes </Link>
                <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;