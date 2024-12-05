function showLogSection() {
    //Hide all sections first
    const sections = ['crop-logs-section', 'field-logs-section', 'staff-logs-section'];
    sections.forEach(section => document.getElementById(section).style.display = 'none');


    //display selected form and tables section
    const  selection = document.getElementById('logCategory').value;
    if (selection === 'crop') {
        document.getElementById('crop-logs-section').style.display = 'block';
    } else if (selection === 'field') {
        document.getElementById('field-logs-section').style.display = 'block';
    } else if (selection === 'staff') {
        document.getElementById('staff-logs-section').style.display = 'block';
    }
}

document.getElementById('logImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('previewImageLog');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('d-none');  // Show the image
        };
        reader.readAsDataURL(file);
    }
});