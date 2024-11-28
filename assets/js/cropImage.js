document.getElementById('cropImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('previewImageCrop');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('d-none');  // Show the image
        };
        reader.readAsDataURL(file);
    }
});