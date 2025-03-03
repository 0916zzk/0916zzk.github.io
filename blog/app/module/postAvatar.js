import $ from "jquery"
export default class postAvatar {
    constructor({ inputEle, displayEle, submitEle, callback }) {
        this.submitEle = $(submitEle)
        this.displayEle = $(displayEle)
        this.inputbtn = $(inputEle)
        this.inputEle = $(inputEle).next("input")
        this.callback = callback
        this.cropper = null
        this.listen()
    }
    listen() {
        this.inputbtn.on("click", (e) => {
            this.inputEle.click()
        })
        this.inputEle.on("change", (e) => {

            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.displayEle.attr("src", e.target.result)
                    this.cropper = new Cropper(this.displayEle[0], {
                        aspectRatio: 1,
                        viewMode: 1,
                        dragMode: 'move'
                    });
                };
                reader.readAsDataURL(file);
            }
        })


        this.submitEle.on("click", () => {
            if (!this.cropper) return false
            const croppedCanvas = this.cropper.getCroppedCanvas();
            const croppedDataURL = croppedCanvas.toDataURL('image/jpeg');
            this.cropper.destroy()
            this.displayEle.attr("src", croppedDataURL)
            const blob = dataURLtoBlob(croppedDataURL)
            const file = new File([blob], 'cropped_image.jpg', { type: blob.type });
            const formData = new FormData();
            formData.append('file', file);
            this.callback(formData)
        })
    }
}
function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}
