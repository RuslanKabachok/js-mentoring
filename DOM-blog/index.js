let comments = JSON.parse(localStorage.getItem('comments')) || [];
let replyToId = null;

const commentForm = document.getElementById('commentForm');
const authorInput = document.getElementById('author');
const textInput = document.getElementById('comment');
const commentList = document.getElementById('commentList');
const actionBtn = document.getElementById('actionBtn');


const saveComments = () => {
    localStorage.setItem('comments', JSON.stringify(comments))
}
const renderComments = () => {
    commentList.innerHTML = '';

    comments.forEach(comment => commentList.appendChild(createCommentElement(comment)));
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
    </div>`;
    return li;
}

renderComments();

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const comment = {
        id: crypto.randomUUID(),
        author: authorInput.value,
        text: textInput.value,
        date: new Date().toLocaleString('uk-UA'),
        parentComment: replyToId,
    }

    comments.push(comment);
    saveComments();
    commentList.appendChild(createCommentElement(comment));
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

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '❌ Скасувати';
        cancelBtn.className = 'cancel-edit-btn';

        li.innerHTML = '';
        li.appendChild(textarea);
        li.appendChild(saveBtn);
        li.appendChild(cancelBtn);

        comment.text = prompt('Редагуйте коментар:', comment.text);
        saveComments();
        renderComments();
    }
});
