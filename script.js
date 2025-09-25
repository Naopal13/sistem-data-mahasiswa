// script.js
// Array to store all student data
let studentsData = [];

document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('studentForm');
    const formSection = document.getElementById('formSection');
    const collectionSection = document.getElementById('collectionSection');

    // Load existing data from storage (if any)
    loadStudentsData();

    // Handle form submission
    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            id: Date.now(), // Simple ID generation
            nama: document.getElementById('nama').value.trim(),
            npm: parseInt(document.getElementById('npm').value),
            jenisKelamin: document.getElementById('jenisKelamin').value,
            ttl: document.getElementById('ttl').value.trim(),
            alamat: document.getElementById('alamat').value.trim(),
            tahunMasuk: parseInt(document.getElementById('tahunMasuk').value),
            ipk: parseFloat(document.getElementById('ipk').value),
            timestamp: new Date().toLocaleString('id-ID')
        };

        // Validate data
        if (!validateData(formData)) {
            return;
        }

        // Check for duplicate NPM
        if (studentsData.find(student => student.npm === formData.npm)) {
            showError('npm', 'NPM sudah terdaftar!');
            return;
        }

        // Calculate predicate (sama seperti di Java)
        formData.predikat = calculatePredicate(formData.ipk);
        
        // Add to collection
        studentsData.push(formData);
        
        // Save to storage
        saveStudentsData();
        
        // Update display
        renderStudentsCollection();
        updateStats();
        
        // Show collection section
        collectionSection.style.display = 'block';
        
        // Reset form
        studentForm.reset();
        clearErrorMessages();
        
        // Smooth scroll to collection
        setTimeout(() => {
            collectionSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
        // Show success message
        showSuccessMessage('Data mahasiswa berhasil ditambahkan!');
    });

    // Form reset handler
    studentForm.addEventListener('reset', function() {
        clearErrorMessages();
    });
    
    // Add input formatting
    setupInputFormatting();
    setupRealTimeValidation();
});

// Load students data from memory storage
function loadStudentsData() {
    // In this version, we keep data in memory only
    // In a real application, you would load from localStorage or database
    if (studentsData.length > 0) {
        document.getElementById('collectionSection').style.display = 'block';
        renderStudentsCollection();
        updateStats();
    }
}

// Save students data to memory (in real app, would save to localStorage)
function saveStudentsData() {
    // In a real application, you would save to localStorage:
    // localStorage.setItem('studentsData', JSON.stringify(studentsData));
    console.log('Data saved:', studentsData);
}

// Validation function
function validateData(data) {
    let isValid = true;
    
    // Clear previous error messages
    clearErrorMessages();
    
    // Validate required fields
    if (!data.nama) {
        showError('nama', 'Nama tidak boleh kosong');
        isValid = false;
    }
    
    if (!data.npm || data.npm <= 0) {
        showError('npm', 'NPM harus berupa angka positif');
        isValid = false;
    }
    
    if (!data.jenisKelamin) {
        showError('jenisKelamin', 'Jenis kelamin harus dipilih');
        isValid = false;
    }
    
    if (!data.ttl) {
        showError('ttl', 'Tempat tanggal lahir tidak boleh kosong');
        isValid = false;
    }
    
    if (!data.alamat) {
        showError('alamat', 'Alamat tidak boleh kosong');
        isValid = false;
    }
    
    if (!data.tahunMasuk || data.tahunMasuk < 2000 || data.tahunMasuk > 2030) {
        showError('tahunMasuk', 'Tahun masuk harus antara 2000-2030');
        isValid = false;
    }
    
    // Validate IPK (sama seperti validasi di Java)
    if (isNaN(data.ipk) || data.ipk < 0.0 || data.ipk > 4.0) {
        showError('ipk', 'IPK tidak valid. Harus antara 0.0 dan 4.0');
        isValid = false;
    }
    
    return isValid;
}

// Calculate predicate based on IPK (sama seperti logika di Java)
function calculatePredicate(ipk) {
    if (ipk >= 3.75) {
        return "Cumlaude";
    } else if (ipk >= 3.0) {
        return "Sangat Memuaskan";
    } else if (ipk >= 2.0) {
        return "Memuaskan";
    } else {
        return "Perlu Perbaikan";
    }
}

// Render all students in collection
function renderStudentsCollection() {
    const container = document.getElementById('studentsContainer');
    container.innerHTML = '';

    if (studentsData.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p style="font-size: 1.2rem;">Belum ada data mahasiswa</p>
                <p>Silakan tambah data mahasiswa menggunakan form di atas</p>
            </div>
        `;
        return;
    }

    studentsData.forEach((student, index) => {
        const studentCard = createStudentCard(student, index);
        container.appendChild(studentCard);
    });
}

// Create student card element
function createStudentCard(student, index) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
        <button class="delete-btn" onclick="deleteStudent(${student.id})" title="Hapus data">
            <i class="fas fa-times"></i>
        </button>
        <div class="card-header">
            <div class="avatar">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div class="student-info">
                <h3>${student.nama}</h3>
                <span class="npm-badge">NPM: ${student.npm}</span>
            </div>
        </div>
        <div class="card-body">
            <div class="info-grid">
                <div class="info-item">
                    <i class="fas fa-venus-mars"></i>
                    <span class="label">Jenis Kelamin:</span>
                    <span>${student.jenisKelamin}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span class="label">TTL:</span>
                    <span>${student.ttl}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-home"></i>
                    <span class="label">Alamat:</span>
                    <span>${student.alamat}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span class="label">Tahun Masuk:</span>
                    <span>${student.tahunMasuk}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-chart-line"></i>
                    <span class="label">IPK:</span>
                    <span class="ipk-value">${student.ipk.toFixed(2)}</span>
                </div>
                <div class="info-item predikat-item">
                    <i class="fas fa-trophy"></i>
                    <span class="label">Predikat:</span>
                    <span class="predikat-badge ${getPredicateClass(student.predikat)}">${student.predikat}</span>
                </div>
            </div>
            <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                <small style="color: #666;">
                    <i class="fas fa-clock"></i> Ditambahkan: ${student.timestamp}
                </small>
            </div>
        </div>
    `;
    return card;
}

// Get predicate CSS class
function getPredicateClass(predikat) {
    switch(predikat) {
        case 'Cumlaude':
            return 'predikat-cumlaude';
        case 'Sangat Memuaskan':
            return 'predikat-sangat-memuaskan';
        case 'Memuaskan':
            return 'predikat-memuaskan';
        case 'Perlu Perbaikan':
            return 'predikat-perlu-perbaikan';
        default:
            return '';
    }
}

// Update statistics
function updateStats() {
    const totalStudents = studentsData.length;
    const cumloudeCount = studentsData.filter(student => student.predikat === 'Cumlaude').length;
    
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('cumloudeCount').textContent = cumloudeCount;
}

// Delete student
function deleteStudent(studentId) {
    if (confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini?')) {
        studentsData = studentsData.filter(student => student.id !== studentId);
        saveStudentsData();
        renderStudentsCollection();
        updateStats();
        
        if (studentsData.length === 0) {
            document.getElementById('collectionSection').style.display = 'none';
        }
        
        showSuccessMessage('Data mahasiswa berhasil dihapus!');
    }
}

// Clear all data
function clearAllData() {
    if (studentsData.length === 0) {
        showErrorMessage('Tidak ada data untuk dihapus!');
        return;
    }
    
    if (confirm(`Apakah Anda yakin ingin menghapus semua data (${studentsData.length} mahasiswa)?`)) {
        studentsData = [];
        saveStudentsData();
        renderStudentsCollection();
        updateStats();
        document.getElementById('collectionSection').style.display = 'none';
        showSuccessMessage('Semua data mahasiswa berhasil dihapus!');
    }
}

// Export data
function exportData() {
    if (studentsData.length === 0) {
        showErrorMessage('Tidak ada data untuk diekspor!');
        return;
    }
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,Nama,NPM,Jenis Kelamin,TTL,Alamat,Tahun Masuk,IPK,Predikat,Tanggal Input\n";
    
    studentsData.forEach((student, index) => {
        const row = [
            index + 1,
            `"${student.nama}"`,
            student.npm,
            `"${student.jenisKelamin}"`,
            `"${student.ttl}"`,
            `"${student.alamat}"`,
            student.tahunMasuk,
            student.ipk.toFixed(2),
            `"${student.predikat}"`,
            `"${student.timestamp}"`
        ].join(",");
        csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_mahasiswa_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessMessage('Data berhasil diekspor ke file CSV!');
}

// Show error message for form fields
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    field.style.borderColor = '#e11d48';
    
    // Create and add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e11d48';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    formGroup.appendChild(errorDiv);
    
    // Add shake animation
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

// Clear error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#e1e5e9';
    });
}

// Show success message (toast notification)
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success-toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Show error message (toast notification)
function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error-toast';
    toast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Setup input formatting
function setupInputFormatting() {
    // Format NPM input to only accept numbers
    const npmInput = document.getElementById('npm');
    if (npmInput) {
        npmInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Format IPK input
    const ipkInput = document.getElementById('ipk');
    if (ipkInput) {
        ipkInput.addEventListener('input', function() {
            let value = this.value.replace(/[^0-9.]/g, '');
            // Ensure only one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            // Limit to 4.00
            if (parseFloat(value) > 4) {
                value = '4.00';
            }
            this.value = value;
        });
    }
    
    // Format Tahun Masuk input
    const tahunInput = document.getElementById('tahunMasuk');
    if (tahunInput) {
        tahunInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
        });
    }
}

// Setup real-time validation
function setupRealTimeValidation() {
    const form = document.getElementById('studentForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            const formGroup = this.closest('.form-group');
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
                this.style.borderColor = '#e1e5e9';
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    let isValid = true;
    
    // Clear existing errors for this field
    const formGroup = field.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#e1e5e9';
    
    // Validate based on field type
    switch(fieldId) {
        case 'nama':
            if (!value) {
                showError('nama', 'Nama tidak boleh kosong');
                isValid = false;
            } else if (value.length < 2) {
                showError('nama', 'Nama minimal 2 karakter');
                isValid = false;
            }
            break;
            
        case 'npm':
            const npm = parseInt(value);
            if (!value || npm <= 0) {
                showError('npm', 'NPM harus berupa angka positif');
                isValid = false;
            } else if (value.length < 8) {
                showError('npm', 'NPM minimal 8 digit');
                isValid = false;
            }
            break;
            
        case 'jenisKelamin':
            if (!value) {
                showError('jenisKelamin', 'Jenis kelamin harus dipilih');
                isValid = false;
            }
            break;
            
        case 'ttl':
            if (!value) {
                showError('ttl', 'Tempat tanggal lahir tidak boleh kosong');
                isValid = false;
            }
            break;
            
        case 'alamat':
            if (!value) {
                showError('alamat', 'Alamat tidak boleh kosong');
                isValid = false;
            } else if (value.length < 10) {
                showError('alamat', 'Alamat terlalu singkat');
                isValid = false;
            }
            break;
            
        case 'tahunMasuk':
            const tahun = parseInt(value);
            if (!value || tahun < 2000 || tahun > 2030) {
                showError('tahunMasuk', 'Tahun masuk harus antara 2000-2030');
                isValid = false;
            }
            break;
            
        case 'ipk':
            const ipk = parseFloat(value);
            if (!value || isNaN(ipk) || ipk < 0.0 || ipk > 4.0) {
                showError('ipk', 'IPK harus antara 0.0 dan 4.0');
                isValid = false;
            }
            break;
    }
    
    return isValid;
}

// Add styles for toast notifications and animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .error-message {
        animation: slideInUp 0.3s ease-out;
    }
    
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        border-left: 4px solid #667eea;
        max-width: 350px;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .success-toast {
        border-left-color: #10b981;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
    }
    
    .success-toast i {
        color: #10b981;
    }
    
    .error-toast {
        border-left-color: #ef4444;
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
    }
    
    .error-toast i {
        color: #ef4444;
    }
    
    .toast span {
        font-weight: 500;
        color: #333;
    }
`;

// Append styles to document head
document.head.appendChild(style);