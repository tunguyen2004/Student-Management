async function initializeDashboard() {
    try {
        // Fetch all data in parallel
        const [studentRes, teacherRes, classRes, subjectRes] = await Promise.all([
            getStudents(),
            getTeachers(),
            getClasses(),
            getSubjects()
        ]);

        // Defensively get the data array from the response
        const students = studentRes.data || studentRes;
        const teachers = teacherRes.data || teacherRes;
        const classes = classRes.data || classRes;
        const subjects = subjectRes.data || subjectRes;

        // Check if all data is loaded correctly
        if (![students, teachers, classes, subjects].every(Array.isArray)) {
            throw new Error("Failed to load all required data.");
        }

        // Update the statistic cards
        updateStatCards({ students, teachers, classes, subjects });

        // Process and render charts
        const { gradeCounts, genderCounts } = processStudentData(students, classes);
        renderStudentsByGradeChart(gradeCounts);
        renderGenderDistributionChart(genderCounts);

    } catch (error) {
        console.error("Error initializing dashboard:", error);
        // Optionally, display an error message to the user on the dashboard
    }
}

function updateStatCards({ students, teachers, classes, subjects }) {
    document.getElementById('student-count').textContent = students.length;
    document.getElementById('teacher-count').textContent = teachers.length;
    document.getElementById('class-count').textContent = classes.length;
    document.getElementById('subject-count').textContent = subjects.length;
}

function processStudentData(students, classes) {
    const gradeCounts = { '10': 0, '11': 0, '12': 0 };
    const genderCounts = { 'male': 0, 'female': 0, 'other': 0 };

    const classGradeMap = new Map(classes.map(cls => [cls.id, cls.grade]));

    students.forEach(student => {
        // Count genders
        if (genderCounts.hasOwnProperty(student.gender)) {
            genderCounts[student.gender]++;
        }

        // Count grades
        const grade = classGradeMap.get(student.class_id);
        if (grade && gradeCounts.hasOwnProperty(grade)) {
            gradeCounts[grade]++;
        }
    });

    return { gradeCounts, genderCounts };
}

function renderStudentsByGradeChart(gradeCounts) {
    const ctx = document.getElementById('studentsByGradeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Khối 10', 'Khối 11', 'Khối 12'],
            datasets: [{
                label: 'Số học sinh',
                data: [gradeCounts['10'], gradeCounts['11'], gradeCounts['12']],
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sĩ số học sinh theo khối',
                    font: { size: 18 }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderGenderDistributionChart(genderCounts) {
    const ctx = document.getElementById('genderDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Nam', 'Nữ', 'Khác'],
            datasets: [{
                label: 'Tỷ lệ giới tính',
                data: [genderCounts.male, genderCounts.female, genderCounts.other],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(168, 85, 247, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(168, 85, 247, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tỷ lệ giới tính học sinh',
                    font: { size: 18 }
                },
                legend: {
                    position: 'top',
                }
            }
        }
    });
}