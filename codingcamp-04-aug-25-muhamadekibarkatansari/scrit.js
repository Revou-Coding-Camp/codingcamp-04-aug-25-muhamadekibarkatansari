const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");
const filterBtn = document.getElementById("filter-btn");
const todoTableBody = document.getElementById("todo-table-body");

const taskError = document.getElementById("task-error");
const dateError = document.getElementById("date-error");
const filterInfo = document.getElementById("filter-info");

const popupOverlay = document.getElementById("popup-overlay");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

const emptyPopup = document.getElementById("empty-popup");
const okEmptyBtn = document.getElementById("ok-empty-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filterMode = true;

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoTableBody.innerHTML = "";

  const filteredTodos = filterMode
    ? todos.filter(todo => !todo.completed)
    : todos;

  if (filteredTodos.length === 0) {
    todoTableBody.innerHTML = '<tr><td colspan="4" class="no-task">No task found</td></tr>';
    return;
  }

  filteredTodos.forEach((todo, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>${todo.completed ? "Done" : "Pending"}</td>
      <td>
        <button class="action-btn done" onclick="toggleStatus(${index})">✔</button>
        <button class="action-btn delete" onclick="deleteTodo(${index})">🗑</button>
      </td>
    `;

    todoTableBody.appendChild(row);
  });
}

function addTodo() {
  const task = todoInput.value.trim();
  const date = dateInput.value;
  let hasError = false;

  taskError.textContent = "";
  dateError.textContent = "";

  if (!task) {
    taskError.textContent = "Silakan isi tugas";
    hasError = true;
  }

  if (!date) {
    dateError.textContent = "Silakan isi tanggal";
    hasError = true;
  }

  if (hasError) return;

  todos.push({ task, date, completed: false });
  saveTodos();
  todoInput.value = "";
  dateInput.value = "";
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

function deleteAll() {
  if (todos.length === 0) {
    emptyPopup.style.display = "flex";
    emptyPopup.classList.add("show");
    return;
  }

  popupOverlay.style.display = "flex";
  popupOverlay.classList.add("show");
}

function toggleStatus(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function toggleFilter() {
  filterMode = !filterMode;

  if (filterMode) {
    filterBtn.textContent = "SHOW ALL";
    filterInfo.textContent = "Menampilkan hanya tugas yang belum selesai";
  } else {
    filterBtn.textContent = "FILTER";
    filterInfo.textContent = "";
  }

  renderTodos();
}

// Modal Konfirmasi Delete All
cancelDeleteBtn.addEventListener("click", () => {
  popupOverlay.classList.remove("show");
  setTimeout(() => {
    popupOverlay.style.display = "none";
  }, 300);
});

confirmDeleteBtn.addEventListener("click", () => {
  todos = [];
  saveTodos();
  filterMode = true;
  filterBtn.textContent = "SHOW ALL";
  filterInfo.textContent = "Menampilkan hanya tugas yang belum selesai";

  popupOverlay.classList.remove("show");
  setTimeout(() => {
    popupOverlay.style.display = "none";
    renderTodos();
    showToast("Data berhasil dihapus");
  }, 300);
});

// Modal Tidak Ada Data
okEmptyBtn.addEventListener("click", () => {
  emptyPopup.classList.remove("show");
  setTimeout(() => {
    emptyPopup.style.display = "none";
  }, 300);
});

// Toast
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Inisialisasi saat load
filterBtn.textContent = "SHOW ALL";
filterInfo.textContent = "Menampilkan hanya tugas yang belum selesai";
renderTodos();

// Event Listeners
addBtn.addEventListener("click", addTodo);
deleteAllBtn.addEventListener("click", deleteAll);
filterBtn.addEventListener("click", toggleFilter);
