document.getElementById('fieldImage1').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('previewImage1');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('d-none');  // Show the image
        };
        reader.readAsDataURL(file);
    }
});

// Image Upload Preview for Field Image 2
document.getElementById('fieldImage2').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('previewImage2');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('d-none');  // Show the image
        };
        reader.readAsDataURL(file);
    }
});