function showLogSection() {
    //Hide all sections first
    const sections = ['crop-logs-section', 'field-logs-section', 'staff-logs-section'];
    sections.forEach(section => document.getElementById(section).style.display = 'none');

    //Hide all tables first
    const tables = ['crop-logs-table', 'field-logs-table', 'staff-logs-table'];
    tables.forEach(table => document.getElementById(table).style.display = 'none');

    //display selected form and tables section
    const  selection = document.getElementById('logCategory').value;
    if (selection === 'crop') {
        document.getElementById('crop-logs-section').style.display = 'block';
        document.getElementById('crop-logs-table').style.display = 'block';
    } else if (selection === 'field') {
        document.getElementById('field-logs-section').style.display = 'block';
        document.getElementById('field-logs-table').style.display = 'block';
    } else if (selection === 'staff') {
        document.getElementById('staff-logs-section').style.display = 'block';
        document.getElementById('staff-logs-table').style.display = 'block';
    }
}