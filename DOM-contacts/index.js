let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let editingId = null;

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('contactName');
const numberInput = document.getElementById('contactNumber');
const emailInput = document.getElementById('contactEmail');
const searchInput = document.getElementById('searchInput');
const contactList = document.getElementById('contactList');
const submitBtn = document.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (editingId === null) {
        const newContact = {
            id: Date.now(),
            name: nameInput.value,
            phone: numberInput.value,
            email: emailInput.value,
        }

        contacts.push(newContact);
    } else {
        const contactToUpdate = contacts.find(c => c.id === editingId);

        contactToUpdate.name = nameInput.value;
        contactToUpdate.phone = numberInput.value;
        contactToUpdate.email = emailInput.value;

        editingId = null;
        submitBtn.textContent = 'Додати контакт';
    }

    localStorage.setItem('contacts', JSON.stringify(contacts));

    renderContacts();
    contactForm.reset();
})

const renderContacts = (contactsToRender = contacts) => {
    contactList.innerHTML = '';

    if (contactsToRender.length === 0) {
        const emptyList = document.createElement('li');
        emptyList.textContent = 'Контактів не знайдено';
        contactList.appendChild(emptyList);
    } else {
        for (let i = 0; i < contactsToRender.length; i++) {
            const element = contactsToRender[i];
            const li = document.createElement('li');
            const infoDiv = document.createElement('div');
            infoDiv.className = 'contact-info';
            const nameDiv = document.createElement('div');
            nameDiv.className = 'contact-name';
            nameDiv.textContent = element.name;
            const phoneDiv = document.createElement('div');
            phoneDiv.className = 'contact-phone';
            phoneDiv.textContent = element.phone;
            const emailDiv = document.createElement('div');
            emailDiv.className = 'contact-email';
            emailDiv.textContent = element.email;
            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(phoneDiv);
            infoDiv.appendChild(emailDiv);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Видалити';
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Редагувати';
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'contact-buttons';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => editContact(element.id));
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteContact(element.id));
            buttonsDiv.appendChild(editBtn);
            buttonsDiv.appendChild(deleteBtn);
            li.appendChild(infoDiv);
            li.appendChild(buttonsDiv);
            contactList.appendChild(li);
        }
    }
}

const editContact = (id) => {
    editingId = id;
    const contactToEdit = contacts.find(c => c.id === id);
    submitBtn.textContent = 'Оновити контакт';
    nameInput.value = contactToEdit.name;
    numberInput.value = contactToEdit.phone;
    emailInput.value = contactToEdit.email;
}

const deleteContact = (id) => {
    contacts = contacts.filter(c => c.id !== id);

    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts();
}

searchInput.addEventListener('input', (e) => {
    const query = searchInput.value.toLowerCase().trim();

    const filteredContacts = contacts.filter(c => {
        return c.name.toLowerCase().includes(query) || c.phone.includes(query);
    });

    renderContacts(filteredContacts);
})

renderContacts();