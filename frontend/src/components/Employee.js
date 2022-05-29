import React, { useState, useEffect } from 'react';
import { Variables } from '../utils/Variables.js';

const Employee = () => {
  const [formData, setFormData] = useState({
    departments: [],
    employees: [],
    modalTitle: '',
    EmployeeId: 0,
    EmployeeName: '',
    Department: '',
    DateOfJoining: '',
    PhotoFileName: 'anonymous.png',
    PhotoPath: Variables.PHOTO_URL
  });

  const { departments, employees, modalTitle, EmployeeId, EmployeeName, Department, DateOfJoining, PhotoFileName, PhotoPath } = formData;

  useEffect(() => {
    refreshList();
  }, [])

  const refreshList = () => {
    fetch(Variables.API_URL + 'employee')
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          ...formData,
          employees: data
        });
      });

    fetch(Variables.API_URL + 'department')
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          ...formData,
          departments: data
        });
      });
  }

  const changeEmployeeName = (e) => {
    setFormData({
      ...formData,
      EmployeeName: e.target.value
    });
  }
  const changeDepartment = (e) => {
    setFormData({
      ...formData,
      Department: e.target.value
    });
  }
  const changeDateOfJoining = (e) => {
    setFormData({
      ...formData,
      DateOfJoining: e.target.value
    });
  }

  const addClick = () => {
    setFormData({
      ...formData,
      modalTitle: 'Add Employee',
      EmployeeId: 0,
      EmployeeName: '',
      Department: '',
      DateOfJoining: '',
      PhotoFileName: 'anonymous.png',
    });
  }

  const editClick = (emp) => {
    setFormData({
      ...formData,
      modalTitle: 'Edit Employee',
      EmployeeId: emp.EmployeeId,
      EmployeeName: emp.EmployeeName,
      Department: emp.Department,
      DateOfJoining: emp.DateOfJoining,
      PhotoFileName: emp.PhotoFileName,
    });
  }

  const createClick = () => {
    fetch(Variables.API_URL + 'employee', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        EmployeeName: EmployeeName,
        Department: Department,
        DateOfJoining: DateOfJoining,
        PhotoFileName: PhotoFileName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data);
        refreshList();
      },
      (err) => { alert(`Failed :\n` + err); }
      );
  }

  const updateClick = () => {
    fetch(Variables.API_URL + 'employee', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        EmployeeId: EmployeeId,
        EmployeeName: EmployeeName,
        Department: Department,
        DateOfJoining: DateOfJoining,
        PhotoFileName: PhotoFileName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data);
        refreshList();
      },
      (err) => { alert(`Failed :\n` + err); }
      );
  }

  const deleteClick = (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(Variables.API_URL + 'employee/' + id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data);
          refreshList();
        },
        (err) => { alert(`Failed :\n` + err); }
        );
    }
  }

  const imageUpload = (e) => {
    e.preventDefault();
    const tempFormData = new FormData();
    tempFormData.append('file', e.target.files[0], e.target.files[0].name);

    fetch(Variables.API_URL + 'employee/savefile', {
      method: 'POST',
      body: tempFormData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          ...formData,
          PhotoFileName: data
        })
      });
  }

  return (
    <div>
      <button
        type='button'
        className='btn btn-primary m-2 float-end'
        data-bs-toggle='modal'
        data-bs-target='#exampleModal'
        onClick={() => addClick()}
      >
        Add Employee
      </button>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>EmployeeId</th>
            <th>EmployeeName</th>
            <th>Department</th>
            <th>DOJ</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.EmployeeId}>
              <td>{emp.EmployeeId}</td>
              <td>{emp.EmployeeName}</td>
              <td>{emp.Department}</td>
              <td>{emp.DateOfJoining}</td>
              <td>
                <button
                  type='button'
                  className='btn btn-light mr-1'
                  data-bs-toggle='modal'
                  data-bs-target='#exampleModal'
                  onClick={() => editClick(emp)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-pencil-square'
                    viewBox='0 0 16 16'
                  >
                    <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                    <path
                      fillRule='evenodd'
                      d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'
                    />
                  </svg>
                </button>
                <button
                  type='button'
                  className='btn btn-light mr-1'
                  onClick={() => deleteClick(emp.EmployeeId)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-trash-fill'
                    viewBox='0 0 16 16'
                  >
                    <path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z' />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className='modal fade'
        id='exampleModal'
        tabIndex='-1'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>{modalTitle}</h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <div className='d-flex flex-row bd-highlight mb-3'>
                <div className='p-2 w-50 bd-highlight'>
                  <div className='input-group mb-3'>
                    <span className='input-group-text'>Emp Name</span>
                    <input
                      type='text'
                      className='form-control'
                      value={EmployeeName}
                      onChange={(e) => changeEmployeeName(e)}
                    />
                  </div>
                  <div className='input-group mb-3'>
                    <span className='input-group-text'>Department</span>
                    <select
                      className='form-select'
                      onChange={(e) => changeDepartment(e)}
                      value={Department}
                    >
                      {departments.map((dep) => (
                        <option key={dep.DepartmentId}>
                          {dep.DepartmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='input-group mb-3'>
                    <span className='input-group-text'>DOJ</span>
                    <input
                      type='date'
                      className='form-control'
                      value={DateOfJoining}
                      onChange={(e) => changeDateOfJoining(e)}
                    />
                  </div>
                </div>
                <div className='p-2 w-50 bd-highlight'>
                  <img
                    width='250px'
                    height='250px'
                    alt={PhotoFileName}
                    src={PhotoPath + PhotoFileName}
                  />
                  <input
                    className='m-2'
                    type='file'
                    onChange={(e) => imageUpload(e)}
                  />
                </div>
              </div>
              {EmployeeId === 0 ? (
                <button
                  type='button'
                  className='btn btn-primary float-start'
                  onClick={() => createClick()}
                >
                  Create
                </button>
              ) : null}
              {EmployeeId !== 0 ? (
                <button
                  type='button'
                  className='btn btn-primary float-start'
                  onClick={() => updateClick()}
                >
                  Update
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;