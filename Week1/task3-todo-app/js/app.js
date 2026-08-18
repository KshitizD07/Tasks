/**
 * Task 3: Interactive To-Do Workspace (TaskPulse)
 * Full JavaScript CRUD, LocalStorage Persistence, Validation & Filters
 */

// Initial State Manager
class TaskManager {
  constructor() {
    this.STORAGE_KEY = 'taskpulse_tasks_v1';
    this.tasks = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || this.getInitialSampleTasks();
    this.currentFilter = 'all';
    this.searchQuery = '';

    this.initDOMReferences();
    this.initEventListeners();
    this.render();
  }

  // Pre-populated default tasks if user opens fresh
  getInitialSampleTasks() {
    return [
      {
        id: '1',
        title: 'Review Task 1 Portfolio requirements',
        category: 'Work',
        priority: 'High',
        dueDate: '2026-08-20',
        completed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Build Task 2 Responsive Landing Page',
        category: 'Work',
        priority: 'High',
        dueDate: '2026-08-21',
        completed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Test JavaScript DOM manipulation & event handling',
        category: 'Learning',
        priority: 'Medium',
        dueDate: '2026-08-22',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
  }

  initDOMReferences() {
    // Form elements
    this.form = document.getElementById('todo-form');
    this.titleInput = document.getElementById('task-title');
    this.categorySelect = document.getElementById('task-category');
    this.prioritySelect = document.getElementById('task-priority');
    this.duedateInput = document.getElementById('task-duedate');
    this.titleError = document.getElementById('title-error');

    // Display elements
    this.tasksContainer = document.getElementById('tasks-container');
    this.totalCountEl = document.getElementById('total-count');
    this.completedCountEl = document.getElementById('completed-count');
    this.activeCounterEl = document.getElementById('active-counter');
    this.progressFillEl = document.getElementById('progress-fill');
    this.progressPercentEl = document.getElementById('progress-percent');

    // Filter & Search controls
    this.searchInput = document.getElementById('search-input');
    this.filterTabs = document.getElementById('filter-tabs');

    // Bulk actions
    this.btnMarkAll = document.getElementById('btn-mark-all');
    this.btnClearCompleted = document.getElementById('btn-clear-completed');

    // Modal elements
    this.editModal = document.getElementById('edit-modal');
    this.editForm = document.getElementById('edit-form');
    this.editIdInput = document.getElementById('edit-task-id');
    this.editTitleInput = document.getElementById('edit-task-title');
    this.editCategorySelect = document.getElementById('edit-task-category');
    this.editPrioritySelect = document.getElementById('edit-task-priority');
    this.modalCloseBtn = document.getElementById('modal-close');
    this.modalCancelBtn = document.getElementById('modal-cancel');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');
  }

  initEventListeners() {
    // 1. Submit New Task Form
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddTask();
    });

    // Clear input validation error on typing
    this.titleInput.addEventListener('input', () => {
      this.titleInput.parentElement.parentElement.classList.remove('has-error');
    });

    // 2. Search & Filter Tab Events
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.render();
    });

    this.filterTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
      }
    });

    // 3. Bulk Actions
    this.btnMarkAll.addEventListener('click', () => this.markAllCompleted());
    this.btnClearCompleted.addEventListener('click', () => this.clearCompleted());

    // 4. Modal Events
    this.modalCloseBtn.addEventListener('click', () => this.closeEditModal());
    this.modalCancelBtn.addEventListener('click', () => this.closeEditModal());
    this.editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveEdit();
    });
  }

  // Save state to LocalStorage
  saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

  // Task CRUD: Create
  handleAddTask() {
    const title = this.titleInput.value.trim();
    if (!title) {
      this.titleInput.parentElement.parentElement.classList.add('has-error');
      this.titleInput.focus();
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      category: this.categorySelect.value,
      priority: this.prioritySelect.value,
      dueDate: this.duedateInput.value || null,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(newTask);
    this.saveToStorage();
    this.render();

    // Reset Form
    this.titleInput.value = '';
    this.duedateInput.value = '';
    this.showToast('Task added successfully!');
  }

  // Task CRUD: Toggle Completion
  toggleTaskComplete(id) {
    this.tasks = this.tasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    this.saveToStorage();
    this.render();
  }

  // Task CRUD: Delete
  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveToStorage();
    this.render();
    this.showToast('Task deleted', 'danger');
  }

  // Task CRUD: Edit Modal Open
  openEditModal(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    this.editIdInput.value = task.id;
    this.editTitleInput.value = task.title;
    this.editCategorySelect.value = task.category;
    this.editPrioritySelect.value = task.priority;

    this.editModal.classList.add('active');
  }

  closeEditModal() {
    this.editModal.classList.remove('active');
  }

  handleSaveEdit() {
    const id = this.editIdInput.value;
    const newTitle = this.editTitleInput.value.trim();

    if (!newTitle) return;

    this.tasks = this.tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          title: newTitle,
          category: this.editCategorySelect.value,
          priority: this.editPrioritySelect.value
        };
      }
      return t;
    });

    this.saveToStorage();
    this.render();
    this.closeEditModal();
    this.showToast('Task updated successfully');
  }

  // Bulk Actions Logic
  markAllCompleted() {
    this.tasks = this.tasks.map(t => ({ ...t, completed: true }));
    this.saveToStorage();
    this.render();
    this.showToast('All tasks marked as completed');
  }

  clearCompleted() {
    const completedCount = this.tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      this.showToast('No completed tasks to clear', 'info');
      return;
    }
    this.tasks = this.tasks.filter(t => !t.completed);
    this.saveToStorage();
    this.render();
    this.showToast(`Cleared ${completedCount} completed task(s)`, 'danger');
  }

  // Filter & Search Logic
  getFilteredTasks() {
    return this.tasks.filter(task => {
      // Matches Search Query
      const matchesSearch = task.title.toLowerCase().includes(this.searchQuery) ||
                            task.category.toLowerCase().includes(this.searchQuery);

      // Matches Filter Tab
      let matchesTab = true;
      if (this.currentFilter === 'pending') matchesTab = !task.completed;
      if (this.currentFilter === 'completed') matchesTab = task.completed;
      if (this.currentFilter === 'high') matchesTab = task.priority === 'High';

      return matchesSearch && matchesTab;
    });
  }

  // Update UI Counters & Stats
  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;

    this.totalCountEl.textContent = total;
    this.completedCountEl.textContent = completed;
    this.activeCounterEl.textContent = `${pending} pending task${pending === 1 ? '' : 's'} remaining`;

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    this.progressFillEl.style.width = `${percent}%`;
    this.progressPercentEl.textContent = `${percent}%`;
  }

  // Toast Notification System
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'danger' ? 'fa-circle-xmark' : 'fa-circle-check';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Render DOM
  render() {
    this.updateStats();
    const filteredTasks = this.getFilteredTasks();

    if (filteredTasks.length === 0) {
      this.tasksContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-clipboard"></i>
          <p>No tasks found. Try adding a new task or changing your filter!</p>
        </div>
      `;
      return;
    }

    this.tasksContainer.innerHTML = filteredTasks.map(task => `
      <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <label class="custom-checkbox">
          <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="app.toggleTaskComplete('${task.id}')">
          <span class="checkmark"></span>
        </label>

        <div class="task-details">
          <span class="task-text">${this.escapeHTML(task.title)}</span>
          <div class="task-tags">
            <span class="tag tag-category">${task.category}</span>
            <span class="tag tag-priority ${task.priority}">${task.priority}</span>
            ${task.dueDate ? `<span class="tag-date"><i class="fa-regular fa-calendar"></i> ${task.dueDate}</span>` : ''}
          </div>
        </div>

        <div class="task-actions">
          <button class="icon-btn edit" onclick="app.openEditModal('${task.id}')" title="Edit Task">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="icon-btn delete" onclick="app.deleteTask('${task.id}')" title="Delete Task">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

// Initialize Application Globally
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new TaskManager();
});
