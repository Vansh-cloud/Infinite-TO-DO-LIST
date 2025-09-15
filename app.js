let todolist = JSON.parse(localStorage.getItem('todolist')) || [];

function saveTodos() {
  localStorage.setItem('todolist', JSON.stringify(todolist));
}

function render() {
  let todolistHTML = '';

  for (let i = 0; i < todolist.length; i++) {
    const todoObj = todolist[i];
    const name = todoObj.name;
    const dueDate = todoObj.dueDate;
    const time = todoObj.time;

    const html = `
      <p>
        ${name} ${dueDate} ${time || ''}
        <button onclick="
          todolist.splice(${i}, 1);
          saveTodos();
          render();
        " class="btn-delete">Delete</button>
      </p>
    `;
    todolistHTML += html;
  }

  document.querySelector('.js-todo-li').innerHTML = todolistHTML;
}

function TODO() {
  const inel = document.querySelector('.in');
  const name = inel.value;

  const date = document.querySelector('.js-date');
  const dueDate = date.value;

  const time = document.querySelector('.js-time');
  const timee = time.value;

  if (name.trim() === '' || dueDate === '') {
    alert("Task name and date are required!");
    return;
  }

  todolist.push({
    name,
    dueDate,
    time: timee
  });

  inel.value = '';
  saveTodos();   // ✅ Save after adding
  render();
}

// ✅ Render saved todos on page load
render();
