import users from './users.js';

let currentUsers = [...users];

const placeholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="1.5">
  <circle cx="12" cy="9" r="3"/>
  <path d="M21 20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14z"/>
  <path d="M16 16l-4-4-4 4"/>
</svg>
`;
function renderUsers(usersToRender) {
  const container = document.getElementById('users-list');
  container.innerHTML = '';


  usersToRender.forEach(user => {
    const photoUrl = user.photo || `data:image/svg+xml;utf8,${encodeURIComponent(placeholderSvg)}`;

    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <img src="${photoUrl}" alt="${user.firstName}" class="user-card__photo" />
      <div class="user-card__info">
        <h3 class="user-card__name">${user.firstName} ${user.lastName}</h3>
        <p class="user-card__age"><strong>Возраст:</strong> ${user.age}</p>
        <p class="user-card__email"><strong>Email:</strong> ${user.email}</p>
        <div class="user-card__upload">
          <button type="button" class="user-card__upload-btn" data-user-id="${user.id}">🔄 Загрузить фото</button>
          <input type="file" accept="image/*" data-user-id="${user.id}" class="user-card__upload-input" />
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Обработчики загрузки фото
  document.querySelectorAll('.user-card__upload-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const userId = this.dataset.userId;
      const input = document.querySelector(`.user-card__upload-input[data-user-id="${userId}"]`);
      input?.click();
    });
  });

  document.querySelectorAll('.user-card__upload-input').forEach(input => {
    input.addEventListener('change', handlePhotoUpload);
  });
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  const userId = Number(event.target.getAttribute('data-user-id'));

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.photo = e.target.result;
      applyFilterAndSort(); // перерисовываем с учётом текущих фильтра и сортировки
    }
  };
  reader.readAsDataURL(file);
}

function sortUsers(usersArray, sortOption) {
  if (!sortOption) return usersArray;

  return [...usersArray].sort((a, b) => {
    if (sortOption === 'name-asc') {
      return a.firstName.localeCompare(b.firstName, 'ru');
    }
    if (sortOption === 'name-desc') {
      return b.firstName.localeCompare(a.firstName, 'ru');
    }
    if (sortOption === 'lastName-asc') {
      return a.lastName.localeCompare(b.lastName, 'ru');
    }
    if (sortOption === 'lastName-desc') {
      return b.lastName.localeCompare(a.lastName, 'ru');
    }
    if (sortOption === 'age-asc') {
      return a.age - b.age;
    }
    if (sortOption === 'age-desc') {
      return b.age - a.age;
    }
    return 0;
  });
}

function applyFilterAndSort() {
  const minAge = Number(document.getElementById('min-age').value) || 0;
  const sortOption = document.getElementById('sort-by').value;

  // Фильтруем
  let filtered = users.filter(u => u.age >= minAge);
  // Сортируем
  let sorted = sortUsers(filtered, sortOption);

  currentUsers = sorted;
  renderUsers(currentUsers);
}

function resetAll() {
  document.getElementById('min-age').value = 0;
  document.getElementById('sort-by').value = '';
  currentUsers = [...users];
  renderUsers(currentUsers);
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.getElementById('filter-btn').addEventListener('click', applyFilterAndSort);
document.getElementById('sort-by').addEventListener('change', applyFilterAndSort);
document.getElementById('reset-btn').addEventListener('click', resetAll);

// Первый рендер
renderUsers(users);
