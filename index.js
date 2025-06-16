// Variable global para almacenar los datos
let data = {
    users: [],
    students: [],
    subjects: [],
    enrollments: [],
    grades: []
};

let currentUser = null;

// Función para cargar los datos desde el archivo JSON
function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            console.log('Datos cargados', data);
            // Llamar a las funciones para cargar los alumnos y materias
            loadStudentsForTable();
            loadSubjectsForTable();
            loadStudentsForSelect();
            loadSubjectsForSelect();
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
}

// Llamar a la función loadData() cuando la página cargue
window.onload = function() {
    loadData();
    // --- SESSION PERSISTENCE ---
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('login').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        document.getElementById('login').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }
};

// Función de login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = data.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        // --- SESSION PERSISTENCE ---
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('login').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

// Función de logout
function logout() {
    currentUser = null;
     // --- SESSION PERSISTENCE ---
    localStorage.removeItem('currentUser');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login').style.display = 'block';

}
/* ESTUDIANTES */

// Función para cargar los estudiantes en el select de inscripciones
function loadStudentsForSelect() {
    const studentSelect = document.getElementById('studentSelect');
    studentSelect.innerHTML = '';  // Limpiar el select

    // Asegurarse de que los estudiantes estén disponibles
    if (data.students.length === 0) return;

    data.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.innerText = student.name;
        studentSelect.appendChild(option);
    });
}

// Función para cargar los estudiantes en la tabla de la vista
function loadStudentsForTable() {
    const tbody = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    // Asegurarse de que los estudiantes estén disponibles
    if (data.students.length === 0) return;

    data.students.forEach((student) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = student.id;
        row.insertCell(1).innerText = student.name;
        const actionsCell = row.insertCell(2);
        actionsCell.innerHTML = `<button type="button" class="btn-edit" onclick="showStudentForm(true, ${student.id})">Editar</button> / <button type="button" class="btn-delete" onclick="deleteStudent(${student.id})">Eliminar</button>`;
    });
}


// Función para mostrar los estudiantes en la vista
function showStudents() {
    document.getElementById('students').style.display = 'block';
    document.getElementById('subjects').style.display = 'none';
    document.getElementById('enrollments').style.display = 'none';
    document.getElementById('grades').style.display = 'none';
    loadStudentsForTable();
}

// Función para mostrar el formulario de agregar/editar alumno
function showStudentForm(isEdit, studentId = null) {
    if (isEdit) {
        const student = data.students.find(s => s.id === studentId);
        //Change hidden style for label
        document.getElementById('Id').style.display = 'inline';
        //change input type to text
        document.getElementById('studentId').type = 'text';
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
    } else {
        document.getElementById('studentId').value = '';
        document.getElementById('studentName').value = '';
    }
    document.getElementById('studentForm').style.display = 'block';
}

// Función para guardar el alumno (crear/editar)
function saveStudent(event) {
    event.preventDefault();
    const studentId = document.getElementById('studentId').value;
    const studentName = document.getElementById('studentName').value;

    if (!studentName) {
        alert("Por favor, ingrese el nombre del alumno.");
        return;
    }

    // Si el studentId existe, significa que estamos editando un estudiante existente
    if (studentId) {
        const student = data.students.find(s => s.id == studentId);
        if (student) {
            student.name = studentName;  // Editar
        }
    } else {
        // Si no existe el studentId, estamos creando un nuevo estudiante
        const newId = data.students.length ? Math.max(...data.students.map(s => s.id)) + 1 : 1;
        data.students.push({ id: newId, name: studentName });  // Crear nuevo alumno
    }

    saveData();
    loadStudentsForTable();
    loadStudentsForSelect();
    cancelStudentForm();
}

// Función para cancelar el formulario de alumno
function cancelStudentForm() {
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('studentForm').style.display = 'none';
}

// Función para eliminar un alumno
function deleteStudent(index) {
    if (confirm("¿Estás seguro de eliminar este alumno?")) {
        data.students.splice(index, 1);
        saveData();
        loadStudentsForTable();
        loadStudentsForSelect();
    }
}
function saveData() {
    // Esto en un entorno real podría enviar los datos a un servidor para ser persistidos
    console.log('Datos guardados:', JSON.stringify(data));
}

/* MATERIAS */

// Función para cargar las materias en el select de inscripciones
function loadSubjectsForSelect() {
    const subjectSelect = document.getElementById('subjectSelect');
    subjectSelect.innerHTML = '';  // Limpiar el select

    // Asegurarse de que las materias estén disponibles
    if (data.subjects.length === 0) return;

    data.subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.innerText = subject.name;
        subjectSelect.appendChild(option);
    });
}

// Función para cargar las materias en la tabla de la vista
function loadSubjectsForTable() {
    const tbody = document.getElementById('subjectsTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    // Asegurarse de que las materias estén disponibles
    if (data.subjects.length === 0) return;

    data.subjects.forEach((subject) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = subject.id;
        row.insertCell(1).innerText = subject.name;
        const actionsCell = row.insertCell(2);
        actionsCell.innerHTML = `<button type="button" class="btn-edit" onclick="showSubjectForm(true, ${subject.id})">Editar</button> / <button type="button" class="btn-delete" onclick="deleteSubject(${subject.id})">Eliminar</button>`;
    });
}

// Función para mostrar las materias en la vista
function showSubjects() {
    document.getElementById('students').style.display = 'none';
    document.getElementById('subjects').style.display = 'block';
    document.getElementById('enrollments').style.display = 'none';
    document.getElementById('grades').style.display = 'none';
    loadSubjectsForTable();
}

// Función para mostrar el formulario de agregar/editar materia
function showSubjectForm(isEdit, subjectId = null) {
    if (isEdit) {
        const subject = data.subjects.find(s => s.id === subjectId);
        //Change hidden style for label
        document.getElementById('IdSub').style.display = 'inline';
        //change input type to text
        document.getElementById('subjectId').type = 'text';
        document.getElementById('subjectId').value = subject.id;
        document.getElementById('subjectName').value = subject.name;
    } else {
        document.getElementById('subjectId').value = '';
        document.getElementById('subjectName').value = '';
    }
    document.getElementById('subjectForm').style.display = 'block';
}

// Función para guardar la materia (crear/editar)
function saveSubject(event) {
    event.preventDefault();
    const subjectId = document.getElementById('subjectId').value;
    const subjectName = document.getElementById('subjectName').value;

    if (!subjectName) {
        alert("Por favor, ingrese el nombre de la materia.");
        return;
    }

    if (subjectId) {
        const subject = data.subjects.find(s => s.id == subjectId);
        if (subject) {
            subject.name = subjectName;  // Editar
        }
    } else {
        const newId = data.subjects.length ? Math.max(...data.subjects.map(s => s.id)) + 1 : 1;
        data.subjects.push({ id: newId, name: subjectName });  // Crear
    }

    saveData();
    loadSubjectsForTable();
    loadSubjectsForSelect();
    cancelSubjectForm();
}

// Función para cancelar el formulario de materia
function cancelSubjectForm() {
    document.getElementById('subjectId').value = '';
    document.getElementById('subjectName').value = '';
    document.getElementById('subjectForm').style.display = 'none';
}
// Función para eliminar una materia
function deleteSubject(index) {
    if (confirm("¿Estás seguro de eliminar esta materia?")) {
        data.subjects.splice(index, 1);
        saveData();
        loadSubjectsForTable();
        loadSubjectsForSelect();
    }
}

/*INSCRIPCIONES */

// Función para cargar las inscripciones
function loadEnrollments() {
    const tbody = document.getElementById('enrollmentsTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    // Asegurarse de que las inscripciones existan
    if (data.enrollments.length === 0) return;

    data.enrollments.forEach((enrollment) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = enrollment.studentName;
        row.insertCell(1).innerText = enrollment.subjectName;
        const actionsCell = row.insertCell(2);
        actionsCell.innerHTML = `<button type="button" class="btn-delete" onclick="deleteEnrollment(${enrollment.id})">Eliminar</button>`;
    });
}

// Función para agregar inscripción
function enrollStudent() {
    const studentId = document.getElementById('studentSelect').value;
    const subjectId = document.getElementById('subjectSelect').value;

    // Verificar que los selects no estén vacíos
    if (!studentId || !subjectId) {
        alert("Por favor, selecciona un alumno y una materia.");
        return;
    }

    const studentName = data.students.find(s => s.id == studentId).name;
    const subjectName = data.subjects.find(s => s.id == subjectId).name;

    data.enrollments.push({ studentName, subjectName });
    saveData();
    loadEnrollments();
}

// Función para eliminar inscripción
function deleteEnrollment(index) {
    if (confirm("¿Estás seguro de eliminar esta inscripción?")) {
        data.enrollments.splice(index, 1);
        saveData();
        loadEnrollments();
    }
}

// Función para mostrar las inscripciones en la vista
function showEnrollments() {
    document.getElementById('students').style.display = 'none';
    document.getElementById('subjects').style.display = 'none';
    document.getElementById('enrollments').style.display = 'block';
    document.getElementById('grades').style.display = 'none';
    loadEnrollments();
}

/* CALIFICACIONES */

// Función para capturar calificación
function captureGrade() {
    const enrollmentIndex = document.getElementById('enrollmentSelect').value;
    const grade = document.getElementById('gradeInput').value;

    // Verificar que los datos sean correctos
    if (!enrollmentIndex || !grade) {
        alert("Por favor, selecciona una inscripción y una calificación.");
        return;
    }

    const enrollment = data.enrollments[enrollmentIndex];
    
    data.grades.push({
        studentName: enrollment.studentName,
        subjectName: enrollment.subjectName,
        grade: grade
    });

    saveData();
    loadGrades();
}

// Función para cargar las calificaciones
function loadGrades() {
    const tbody = document.getElementById('gradesTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    // Asegurarse de que las calificaciones existan
    if (data.grades.length === 0) return;

    data.grades.forEach((grade) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = grade.studentName;
        row.insertCell(1).innerText = grade.subjectName;
        row.insertCell(2).innerText = grade.grade;
    });

    loadEnrollmentSelect();
}

// Función para cargar las inscripciones en el select para calificaciones
function loadEnrollmentSelect() {
    const select = document.getElementById('enrollmentSelect');
    select.innerHTML = '';

    data.enrollments.forEach((enrollment) => {
        const option = document.createElement('option');
        option.value = enrollment.id;
        option.innerText = `${enrollment.studentName} - ${enrollment.subjectName}`;
        select.appendChild(option);
    });
}

// Función para mostrar las calificaciones en la vista
function showGrades() {
    document.getElementById('students').style.display = 'none';
    document.getElementById('subjects').style.display = 'none';
    document.getElementById('enrollments').style.display = 'none';
    document.getElementById('grades').style.display = 'block';
    loadGrades();
}
