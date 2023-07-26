window.onload = () => {
    let cats = ['pinned', 'pending', 'completed'];
    for(let cat of cats) {
        let tasks = localStorage.getItem(cat);
        if(tasks !== null && tasks !== '{}') {
            let cont = document.getElementById(cat);
            tasks = JSON.parse(tasks);
            let entries = cat === 'pinned' ? Object.entries(tasks).reverse() : Object.entries(tasks);

            for(let [taskID, task] of entries) {
                cont.insertAdjacentHTML('beforeend',`
                    <div class="task" data-taskid="${taskID}">
                        <div class="control-button">
                            <input onclick="toggleComplete(this)" type="checkbox" ${cat === 'completed' ? 'checked' : ''} title="Mark as complete"/>
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
            }
            let controls = document.getElementById("controls");
            controls.classList.remove("hide-elm");
        }
    }
};

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

        let cont = document.getElementById("pending");
        let taskID = (new Date()).getTime();
        cont.insertAdjacentHTML('beforeend',`
            <div class="task" data-taskid="${taskID}">
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
        modifyStorage('add', {taskID, task, taskType: 'pending'});

        inputText.value = "";
        plusIcon.classList.add("complete");
    }
}

function toggleComplete(elem, hoverToggle=true) {
    let task = elem.parentElement.parentElement;
    let clonedTask = task.cloneNode(true);
    let deleteAllButton = document.getElementById("delete-all");
    let taskObj = getTaskDetails(elem);
    let cont;

    if(elem.checked) {
        cont = document.getElementById("completed");
        deleteAllButton.classList.remove("complete");
        modifyStorage('markcomplete', taskObj);
    }
    else {
        cont = document.getElementById("pending");
        modifyStorage('markincomplete', taskObj);
    }

    cont.insertAdjacentElement('beforeend', clonedTask);
    deleteTask(elem);

    if(hoverToggle) {
        let markAll = document.getElementById("mark-all");
        markAll.checked = allTasksCompleted();
    }
}

function toggleCompleteAll() {
    let allComplete = allTasksCompleted();
    let tasks;

    if(allComplete)
        tasks = [...document.getElementById("completed").children];
    else {
        let pinnedTasks = document.getElementById("pinned").children;
        let pendingTasks = document.getElementById("pending").children;
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
    let pinnedTasks = document.getElementById("pinned").children;
    let pendingTasks = document.getElementById("pending").children;
    let allCompleted = (pinnedTasks.length === 0) && (pendingTasks.length === 0);

    return allCompleted;
}

function checkDisableControls() {
    let pinned = document.getElementById("pinned");
    let pending = document.getElementById("pending");
    let completed = document.getElementById("completed");

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
    let taskObj = getTaskDetails(elem);
    modifyStorage('delete', taskObj);
    elem.parentElement.parentElement.remove();
    checkDisableControls();
}

function deleteAllCompleted() {
    let completed = document.getElementById("completed");
    completed.innerHTML = '';
    localStorage.setItem('completed', '{}');
    checkDisableControls();
}

function togglePin(elem) {
    let task = elem.parentElement.parentElement;
    let taskObj = getTaskDetails(elem);
    let clonedTask = task.cloneNode(true);
    let cont;

    if(!isPinned(elem)) {
        cont = document.getElementById("pinned");
        modifyStorage('pin', taskObj);
    }
    else {
        cont = document.getElementById("pending");
        modifyStorage('unpin', taskObj);
    }

    cont.insertAdjacentElement('afterbegin', clonedTask);
    deleteTask(elem);
}

function isPinned(elem) {
    let container =  elem.parentElement.parentElement.parentElement;
    return container.id === 'pinned';
}

function filter(elem) {
    let buttons = document.getElementsByTagName("button");
    for(let button of buttons)
        button.classList.remove("button-active");
    elem.classList.add("button-active");

    let pinned = document.getElementById("pinned");
    let pending = document.getElementById("pending");
    let completed = document.getElementById("completed");

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

function getTaskDetails(elem) {
    let taskElm = elem.parentElement.parentElement;
    let taskID = taskElm.getAttribute("data-taskid");
    let taskType = taskElm.parentElement.id;
    let task = taskElm.children[1].children[0].value;
    return {taskID, task, taskType};
}

function modifyStorage(action, taskObj) {
    let {taskID, task, taskType} = taskObj;
    if(action === 'add') {
        let pending = JSON.parse(localStorage.getItem("pending") || '{}');
        pending[taskID] = task;
        localStorage.setItem("pending", JSON.stringify(pending));
    }
    else if(action === 'delete') {
        let tasks = JSON.parse(localStorage.getItem(taskType) || '{}');
        delete tasks[taskID];
        localStorage.setItem(taskType, JSON.stringify(tasks));
    }
    else if(action === 'edit') {
        let tasks = JSON.parse(localStorage.getItem(taskType) || '{}');
        tasks[taskID] = task;
        localStorage.setItem(taskType, JSON.stringify(tasks));
    }
    else if(action === 'pin') {
        let pinned = JSON.parse(localStorage.getItem("pinned") || '{}');
        pinned[taskID] = task;
        localStorage.setItem("pinned", JSON.stringify(pinned));
    }
    else if(action === 'unpin') {
        let pending = JSON.parse(localStorage.getItem("pending") || '{}');
        pending[taskID] = task;
        localStorage.setItem("pending", JSON.stringify(pending));
    }
    else if(action === 'markcomplete') {
        let completed = JSON.parse(localStorage.getItem("completed") || '{}');
        completed[taskID] = task;
        localStorage.setItem("completed", JSON.stringify(completed));
    }
    else if(action === 'markincomplete') {
        let pending = JSON.parse(localStorage.getItem("pending") || '{}');
        pending[taskID] = task;
        localStorage.setItem("pending", JSON.stringify(pending));
    }
}