
const toast = document.getElementById('liveToast');

const toastIcon = document.getElementById('toastIcon');
const toastTitle = document.getElementById('toastTitle');
const toastSmallText = document.getElementById('toastSmallText');
const toastBody = document.getElementById('toastBody');
const toastIconColor = document.getElementById('toastIconColor');

let activeTimeout = null;

function showToast(title, icons, smalltext, iconColorClass, timeout, message) {

    // clear previous timeout to avoid malfunction
    if (activeTimeout != null) {
        clearTimeout(activeTimeout);
    }

    toast.classList.add('show');

    // clear all classes
    toastIcon.classList = '';
    toastIconColor.classList = '';

    // add new classes
    toastIconColor.classList.add(iconColorClass);

    for (let iconClass of icons) {
        toastIcon.classList.add(iconClass);
    }

    toastTitle.innerText = title;
    toastSmallText.innerText = smalltext;
    toastBody.innerText = message;

    activeTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, timeout);

}