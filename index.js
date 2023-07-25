function newTask(event) {
    let inputText = event.target;
    let task = inputText.value;
    let plusIcon = inputText.parentElement.parentElement.children[0];

    if(task === '')
        plusIcon.classList.add("complete");
    else
        plusIcon.classList.remove("complete");

    if((event.key === undefined || event.key === 'Enter') && task !== '') {
        let controls = document.getElementById("controls");
        controls.classList.remove("hide-elm");

        let markAll = document.getElementById("mark-all");
        markAll.checked = false;

        let cont = document.getElementById("pending-tasks");
        cont.insertAdjacentHTML('beforeend',`
            <div class="task">
                <div class="control-button">
                    <input onclick="toggleComplete(this)" type="checkbox" title="Mark as complete"/>
                </div>
                <div class="task-name">
                    <input type="text" value="${task}"/>
                </div>
                <div class="control-button">
                    <i onclick="deleteTask(this)" class="fa-solid fa-xmark"></i>
                </div>
                <div class="control-button">
                    <i onclick="togglePin(this)" class="fa-solid fa-thumbtack"></i>
                </div>
            </div>`
        );
        inputText.value = "";
        plusIcon.classList.add("complete");
    }
}

function toggleComplete(elem, hoverToggle=true) {
    let task = elem.parentElement.parentElement;
    let clonedTask = task.cloneNode(true);
    let taskItems = clonedTask.children;
    let taskText = taskItems[1].children[0];
    let pinButton = taskItems[3].children[0];
    let deleteAllButton = document.getElementById("delete-all");
    let cont;

    if(elem.checked) {
        if(isPinned(elem)) {
            taskText.classList.toggle("extra-bold");
            pinButton.classList.toggle("icon-active");
        }
        cont = document.getElementById("completed-tasks");
        deleteAllButton.classList.remove("complete");
    }
    else
        cont = document.getElementById("pending-tasks");

    cont.insertAdjacentElement('beforeend', clonedTask);
    deleteTask(elem);

    taskText.classList.toggle("complete");
    taskText.classList.toggle("strikethrough");
    pinButton.classList.toggle("complete");
    if(hoverToggle) {
        let markAll = document.getElementById("mark-all");
        markAll.checked = allTasksCompleted();
    }
}

function toggleCompleteAll() {
    let allComplete = allTasksCompleted();
    let tasks;

    if(allComplete)
        tasks = [...document.getElementById("completed-tasks").children];
    else {
        let pinnedTasks = document.getElementById("pinned-tasks").children;
        let pendingTasks = document.getElementById("pending-tasks").children;
        tasks = [...pinnedTasks, ...pendingTasks];
    }

    for(let task of tasks) {
        let completeButton = task.children[0].children[0];
        completeButton.checked = !allComplete;
        toggleComplete(completeButton, false);
    }

    checkDisableControls();
}

function allTasksCompleted() {
    let pinnedTasks = document.getElementById("pinned-tasks").children;
    let pendingTasks = document.getElementById("pending-tasks").children;
    let allCompleted = (pinnedTasks.length === 0) && (pendingTasks.length === 0);

    return allCompleted;
}

function checkDisableControls() {
    let pinned = document.getElementById("pinned-tasks");
    let pending = document.getElementById("pending-tasks");
    let completed = document.getElementById("completed-tasks");

    if(pinned.childElementCount === 0 && pending.childElementCount === 0 && completed.childElementCount === 0) {
        let controls = document.getElementById("controls");
        controls.classList.add("hide-elm");
    }
    else if(completed.childElementCount === 0) {
        let deleteAllButton = document.getElementById("delete-all");
        deleteAllButton.classList.add("complete");
    }
}

function deleteTask(elem) {
    elem.parentElement.parentElement.remove();
    checkDisableControls();
}

function deleteAllCompleted() {
    let completed = document.getElementById("completed-tasks");
    completed.innerHTML = '';
    checkDisableControls();
}

function togglePin(elem) {
    let task = elem.parentElement.parentElement;
    let clonedTask = task.cloneNode(true);
    let cont;

    if(!isPinned(elem))
        cont = document.getElementById("pinned-tasks");
    else
        cont = document.getElementById("pending-tasks");

    cont.insertAdjacentElement('afterbegin', clonedTask);

    let taskItems = clonedTask.children;
    let taskText = taskItems[1].children[0];
    let pinButton = taskItems[3].children[0];

    taskText.classList.toggle("extra-bold");
    pinButton.classList.toggle("icon-active");

    deleteTask(elem);
}

function isPinned(elem) {
    let container =  elem.parentElement.parentElement.parentElement;
    return container.id === 'pinned-tasks';
}

function filter(elem) {
    let buttons = document.getElementsByTagName("button");
    for(let button of buttons)
        button.classList.remove("button-active");
    elem.classList.add("button-active");

    let pinned = document.getElementById("pinned-tasks");
    let pending = document.getElementById("pending-tasks");
    let completed = document.getElementById("completed-tasks");

    if(elem.innerText === 'Pinned') {
        pinned.classList.remove("hide-elm");
        pending.classList.add("hide-elm");
        completed.classList.add("hide-elm");
    }
    else if(elem.innerText === 'Pending') {
        pinned.classList.add("hide-elm");
        pending.classList.remove("hide-elm");
        completed.classList.add("hide-elm");
    }
    else if(elem.innerText === 'Completed') {
        pinned.classList.add("hide-elm");
        pending.classList.add("hide-elm");
        completed.classList.remove("hide-elm");
    }
    else {
        pinned.classList.remove("hide-elm");
        pending.classList.remove("hide-elm");
        completed.classList.remove("hide-elm");
    }
}
