function initializeSubjectManagement() {
    loadSubjects();

    const subjectForm = document.getElementById('subjectForm');
    if (subjectForm) {
        subjectForm.addEventListener('submit', handleFormSubmit);
    }
}

async function loadSubjects() {
    try {
        const subjects = await getSubjects();
        
        const subjectTable = document.getElementById('subjectTable');
        if (!subjectTable) return;
        
        // Defensively check if the response is a direct array or nested under a 'data' property
        const subjectList = Array.isArray(subjects) ? subjects : subjects.data;

        if (!Array.isArray(subjectList)) {
            throw new Error("Dữ liệu môn học trả về không phải là một mảng.");
        }

        if (subjectList.length === 0) {
            subjectTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không có dữ liệu môn học.</td></tr>';
            return;
        }

        const rowsHtml = subjectList.map(subject => `
            <tr>
                <td>${subject.subject_code}</td>
                <td>${subject.subject_name}</td>
                <td>${subject.credits}</td>
                <td>${subject.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</td>
                <td class="actions">
                    <button onclick="handleEditSubject(${subject.id})">✏️ Sửa</button>
                    <button onclick="handleDeleteSubject(${subject.id})">🗑️ Xóa</button>
                </td>
            </tr>
        `).join('');

        subjectTable.innerHTML = rowsHtml;
    } catch (error) {
        console.error('Lỗi khi tải danh sách môn học:', error);
        const subjectTable = document.getElementById('subjectTable');
        if (subjectTable) {
            subjectTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">Lỗi khi tải dữ liệu. Vui lòng thử lại.</td></tr>';
        }
    }
}

function openModal(title) {
    const modal = document.getElementById('subjectModal');
    const modalTitle = document.getElementById('modalTitle');
    if (modal && modalTitle) {
        modalTitle.textContent = title;
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('subjectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleAddSubject() {
    const form = document.getElementById('subjectForm');
    if (form) {
        form.reset();
        document.getElementById('subjectId').value = '';
    }
    openModal('Thêm môn học mới');
}

async function handleEditSubject(id) {
    try {
        const subject = await getSubjectById(id);
        const form = document.getElementById('subjectForm');
        if (form) {
            document.getElementById('subjectId').value = subject.id;
            document.getElementById('subject_name').value = subject.subject_name;
            document.getElementById('subject_code').value = subject.subject_code;
            document.getElementById('credits').value = subject.credits;
            document.getElementById('status').value = subject.status;
        }
        openModal('Cập nhật thông tin môn học');
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin môn học ${id}:`, error);
        alert('Không thể tải thông tin môn học.');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('subjectId').value;
    const subjectData = {
        subject_name: document.getElementById('subject_name').value,
        subject_code: document.getElementById('subject_code').value,
        credits: document.getElementById('credits').value,
        status: document.getElementById('status').value,
    };

    try {
        if (id) {
            await updateSubject(id, subjectData);
            alert('Cập nhật môn học thành công!');
        } else {
            await createSubject(subjectData);
            alert('Thêm môn học thành công!');
        }
        closeModal();
        loadSubjects();
    } catch (error) {
        console.error('Lỗi khi lưu thông tin môn học:', error);
        alert('Lưu thông tin thất bại. ' + error.message);
    }
}

async function handleDeleteSubject(id) {
    if (confirm("Bạn có chắc muốn xóa môn học này không?")) {
        try {
            await deleteSubject(id);
            alert("Đã xóa môn học thành công!");
            loadSubjects();
        } catch (error) {
            console.error('Lỗi khi xóa môn học:', error);
            alert("Xóa môn học thất bại.");
        }
    }
}