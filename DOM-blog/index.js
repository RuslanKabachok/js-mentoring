let comments = (() => { try { return JSON.parse(localStorage.getItem('comments')) || []; } catch { return []; } })();
let replyToId = null;

const commentForm = document.getElementById('commentForm');
const authorInput = document.getElementById('author');
const textInput = document.getElementById('comment');
const commentList = document.getElementById('commentList');
const actionBtn = document.getElementById('actionBtn');


const saveComments = () => {
    localStorage.setItem('comments', JSON.stringify(comments))
}

function renderComments(parentId = null, container = commentList) {
    const frag = document.createDocumentFragment();
    const filtered = comments.filter(c => c.parentComment === parentId);

    filtered.forEach(comment => {
        const li = createCommentElement(comment);
        const childUl = document.createElement('ul');
        li.appendChild(childUl);
        frag.appendChild(li);
        renderComments(comment.id, childUl);
    });

    container.replaceChildren(frag);
}

function createCommentElement(comment) {
    const li = document.createElement('li');
    li.dataset.id = comment.id;
    li.innerHTML = `
    <strong>${comment.author}</strong>: ${comment.text}
    <br>
    <small>${comment.date}</small>
    <div class="comment-actions">
    <button class="edit-btn">Редагувати</button>
    <button class="delete-btn">Видалити</button>
    <button class="reply-btn">Відповісти</button>
    </div>`;
    return li;
}

renderComments();

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const author = authorInput.value.trim();
    const text = textInput.value.trim();
    if (!author || !text) return;

    const comment = {
        id: crypto.randomUUID(),
        author: authorInput.value,
        text: textInput.value,
        date: new Date().toLocaleString('uk-UA'),
        parentComment: replyToId,
    }

    comments.push(comment);
    saveComments();

    replyToId = null;
    actionBtn.textContent = 'Опублікувати коментар';
    renderComments();
    commentForm.reset();
})

commentList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    const id = li.dataset.id;
    const index = comments.findIndex(c => c.id === id);

    if (e.target.classList.contains('delete-btn')) {
        comments.splice(index, 1);
        saveComments();
        renderComments();
    }
    else if (e.target.classList.contains('edit-btn')) {
        const li = e.target.closest('li');
        const id = li.dataset.id;
        const comment = comments.find(c => c.id === id);

        const textarea = document.createElement('textarea');
        textarea.value = comment.text;
        textarea.rows = 3;
        textarea.className = 'edit-area';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '💾 Зберегти';
        saveBtn.className = 'save-edit-btn';
        saveBtn.dataset.id = id;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '❌ Скасувати';
        cancelBtn.className = 'cancel-edit-btn';
        cancelBtn.dataset.id = id;

        li.innerHTML = '';
        li.appendChild(textarea);
        li.appendChild(saveBtn);
        li.appendChild(cancelBtn);
    }

    if (e.target.classList.contains('save-edit-btn')) {
        const comment = comments.find(c => c.id === e.target.dataset.id);
        const newText = li.querySelector('.edit-area').value.trim();
        if (newText) {
            comment.text = newText;
            saveComments();
            renderComments();
        }
    } else if (e.target.classList.contains('cancel-edit-btn')) {
        renderComments();
    }

    if (e.target.classList.contains('reply-btn')) {
        const parentId = e.target.closest('li').dataset.id;
        replyToId = parentId;
        textInput.focus();
        actionBtn.textContent = 'Відповісти';
    }

});
