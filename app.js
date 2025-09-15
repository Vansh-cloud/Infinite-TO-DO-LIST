let todolist = JSON.parse(localStorage.getItem('todolist')) || [];

function saveTodos() {
  localStorage.setItem('todolist', JSON.stringify(todolist));
}

function render() {
  const listContainer = document.querySelector('.js-todo-li');
  listContainer.innerHTML = ''; // Clear list before re-rendering

  todolist.forEach((todoObj, i) => {
    const card = document.createElement('div');
    card.classList.add('todo-card');

    card.innerHTML = `
      <div class="todo-left">
        <div class="dot"></div>
        <div>
          <div>${todoObj.name}</div>
          <div class="meta">${todoObj.dueDate} ${todoObj.time || ''}</div>
        </div>
      </div>
      <div class="actions">
        <button class="btn-delete">Delete</button>
      </div>
    `;

    // ✅ attach delete event properly
    card.querySelector('.btn-delete').addEventListener('click', () => {
      todolist.splice(i, 1);
      saveTodos();
      render();
    });

    listContainer.appendChild(card);
  });
}

function TODO() {
  const inel = document.querySelector('.in');
  const name = inel.value.trim();
  const dueDate = document.querySelector('.js-date').value;
  const timee = document.querySelector('.js-time').value;

  if (name === '' || dueDate === '') {
    alert("Task name and date are required!");
    return;
  }

  todolist.push({
    name,
    dueDate,
    time: timee
  });

  inel.value = '';
  document.querySelector('.js-date').value = '';
  document.querySelector('.js-time').value = '';

  saveTodos();
  render();
}

// ✅ Render on page load
render();
