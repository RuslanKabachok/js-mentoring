const inputEl = document.getElementById('createInput');
const addPBtn = document.getElementById('addPBtn');
const addH1Btn = document.getElementById('addH1Btn');
const addH2Btn = document.getElementById('addH2Btn');
const makeTextBoldBtn = document.getElementById('boldBtn');
const makeTextItalicBtn = document.getElementById('italicBtn');
const deleteBtn = document.getElementById('deleteBtn');
const editField = document.getElementById('editor');

addPBtn.addEventListener('click', (e) => {
    if (!inputEl.value.trim()) return;

    const p = document.createElement('p');
    p.textContent = inputEl.value;
    editField.appendChild(p);

    inputEl.value = '';
})