const inputEl = document.getElementById('createInput');
const addPBtn = document.getElementById('addPBtn');
const addH1Btn = document.getElementById('addH1Btn');
const addH2Btn = document.getElementById('addH2Btn');
const makeTextBoldBtn = document.getElementById('boldBtn');
const makeTextItalicBtn = document.getElementById('italicBtn');
const deleteBtn = document.getElementById('deleteBtn');
const editField = document.getElementById('editor');

const saved = loadContent();

if (saved) editField.innerHTML = saved;


function createElement(tagName) {
    if (!inputEl.value.trim()) return;
    const el = document.createElement(tagName);
    el.textContent = inputEl.value;
    editField.appendChild(el);
    inputEl.value = '';
    saveContent();
}

addPBtn.addEventListener('click', () => createElement('p'));
addH1Btn.addEventListener('click', () => createElement('h1'));
addH2Btn.addEventListener('click', () => createElement('h2'));

editField.addEventListener('click', (e) => {
    if (e.target === editField) return;

    e.target.setAttribute('contenteditable', 'true');
    e.target.focus();

    e.target.addEventListener('blur', () => {
        e.target.removeAttribute('contenteditable');
        saveContent();
    }, { once: true });
});

function saveContent() {
    const content = editField.innerHTML;
    localStorage.setItem('content', content);
}

function loadContent() {
    return localStorage.getItem('content');
}