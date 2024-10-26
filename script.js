// Store projects in localStorage for now
const projects = JSON.parse(localStorage.getItem('projects')) || [];

// Check if the user is logged in as admin
let isAdmin = localStorage.getItem('isAdmin') === 'true';

window.onload = () => {
  updateProjectList();
  toggleAdminPanel(isAdmin);

  document.getElementById('admin-login').addEventListener('click', adminLogin);
  document.getElementById('admin-logout').addEventListener('click', adminLogout);
};

// Admin login function (for simplicity, no password validation)
function adminLogin() {
  const password = prompt('Enter admin password:');
  if (password === '201021') {
    isAdmin = true;
    localStorage.setItem('isAdmin', 'true');
    toggleAdminPanel(true);
  } else {
    alert('Incorrect password!');
  }
}

// Admin logout function
function adminLogout() {
  isAdmin = false;
  localStorage.removeItem('isAdmin');
  toggleAdminPanel(false);
}

// Toggle admin panel visibility
function toggleAdminPanel(show) {
  document.getElementById('admin-panel').style.display = show ? 'block' : 'none';
  document.getElementById('admin-login').style.display = show ? 'none' : 'block';
  document.getElementById('admin-logout').style.display = show ? 'block' : 'none';
}

// Add a new project
function addProject() {
  const name = document.getElementById('project-name').value;
  const url = document.getElementById('project-url').value;

  if (name && url) {
    projects.push({ name, url });
    localStorage.setItem('projects', JSON.stringify(projects));
    updateProjectList();
    document.getElementById('project-name').value = '';
    document.getElementById('project-url').value = '';
  } else {
    alert('Please fill in both fields.');
  }
}

function updateProjectList() {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';

  projects.forEach((project, index) => {
    const listItem = document.createElement('li');
    
    const thumbnail = document.createElement('img');
    thumbnail.src = `https://cdn2.scratch.mit.edu/get_image/project/${extractProjectId(project.url)}_480x360.png`;
    thumbnail.alt = project.name;
    
    const nameLabel = document.createElement('span');
    nameLabel.textContent = project.name;

    listItem.appendChild(thumbnail);
    listItem.appendChild(nameLabel);
    listItem.onclick = () => loadProject(project);
    projectList.appendChild(listItem);

    if (isAdmin) {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteProject(index);
      };
      listItem.appendChild(deleteButton);
    }
  });
}

function extractProjectId(url) {
  const match = url.match(/projects\/(\d+)/);
  return match ? match[1] : '';
}


function loadProject(project) {
  document.getElementById('selected-project-name').textContent = project.name;
  window.open(project.url, '_blank'); // Open the Scratch project in a new tab
}

// Delete a project (admin only)
function deleteProject(index) {
  projects.splice(index, 1);
  localStorage.setItem('projects', JSON.stringify(projects));
  updateProjectList();
}
