const API_URL = 'https://todo-app-mao2.onrender.com/api/tasks';

let tasksDrawer = document.querySelector('.tasks-add');
let drawerTrigger = document.querySelector('.add-slider');
let triggerIcon = document.querySelector('.slider-icon');
let allTasks = document.querySelectorAll('.task');

let newTask = document.querySelector('.new-task');
let getTask = document.querySelector('.get-task');
let tasksContainer = document.querySelector('.tasks');
const colors = ['#97c8eb', '#f3d180', '#f4978e', '#98c9a3'];


let isOpen = true; 

drawerTrigger.addEventListener('click', function () {
    tasksDrawer.style.transition = 'bottom 0.3s ease';
    triggerIcon.style.transition = 'transform 0.3s ease';
    
    if (isOpen) {
        tasksDrawer.style.bottom = '0rem'; 
        console.log(isOpen);
        triggerIcon.style.transform = 'rotate(45deg)'
    } else {
        tasksDrawer.style.bottom = '-12rem'; 
        triggerIcon.style.transform = 'rotate(0deg)'
        console.log(isOpen);
    }
    
    isOpen = !isOpen; 
});



// Add new task

async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    tasksContainer.innerHTML = ''; // Clear existing tasks

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.dataset.id = task._id;


        tasks.forEach((task, index) => {  // Added 'index' as the second argument
            const color = colors[index % colors.length];  // Use 'index' for color cycling
            taskDiv.style.backgroundColor = color;
        });



        // Task Title
        const taskTitle = document.createElement('h1');
        taskTitle.className = 'task-title';
        taskTitle.textContent = task.title;

        // Task Details Container
        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';

        // Priority and Due Date Container
        const taskInfo = document.createElement('div');
        taskInfo.className = 'one';

        const taskPriority = document.createElement('div');
        taskPriority.className = 'priority';
        taskPriority.textContent = task.priority || 'MEDIUM'; // Default priority

        const taskDue = document.createElement('div');
        taskDue.className = 'due';
        taskDue.textContent = task.due || 'No Due Date'; // Default due date

        taskInfo.appendChild(taskPriority);
        taskInfo.appendChild(taskDue);

        // Task Actions Container
        const taskActions = document.createElement('div');
        taskActions.className = 'actions';
        taskActions.style.display = 'flex';
        taskActions.style.gap = '1rem';

        // Task Status
        const taskStatus = document.createElement('div');
        taskStatus.className = 'status';
        taskStatus.textContent = task.status;
        taskStatus.addEventListener('click', async function () {
            await updateTaskStatus(task._id, task.status === 'PENDING' ? 'COMPLETED' : 'PENDING');
            fetchTasks(); // Refresh tasks
        });

        // Delete Button
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete-button';
        deleteBtn.textContent = 'DELETE';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.addEventListener('click', async function () {
            await deleteTask(task._id);
            fetchTasks(); // Refresh tasks
        });

        // Append Status and Delete Button to Actions
        taskActions.appendChild(taskStatus);
        taskActions.appendChild(deleteBtn);

        // Append elements to taskDetails
        taskDetails.appendChild(taskInfo);
        taskDetails.appendChild(taskActions);

        // Append elements to taskDiv
        taskDiv.appendChild(taskTitle);
        taskDiv.appendChild(taskDetails);

        // Append taskDiv to tasksContainer
        tasksContainer.appendChild(taskDiv);
    });
}


async function addTask() {
    const title = getTask.value.trim();
    if (!title) return alert('Enter a task');

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    getTask.value = '';
    tasksDrawer.style.bottom = '-12rem'; 

    fetchTasks(); // Refresh tasks
}
async function updateTaskStatus(id, status) {
    await fetch(`${API_URL}/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ status }) 
    });
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}


// Event Listeners
newTask.addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', fetchTasks);

