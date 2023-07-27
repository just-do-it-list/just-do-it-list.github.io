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
                            <input type="text" value="${task}" onfocusin="highlight(this, true)" onfocusout="highlight(this, false)" onkeyup="handleEdit(event)"/>
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
        }
    }
    let markAll = document.getElementById("mark-all");
    markAll.checked = allTasksCompleted();
    enableDisableControls();
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
        let markAll = document.getElementById("mark-all");
        markAll.classList.remove('complete');
        markAll.checked = false;

        let cont = document.getElementById("pending");
        let taskID = (new Date()).getTime();
        cont.insertAdjacentHTML('beforeend',`
            <div class="task appear" data-taskid="${taskID}">
                <div class="control-button">
                    <input onclick="toggleComplete(this)" type="checkbox" title="Mark as complete"/>
                </div>
                <div class="task-name">
                    <input type="text" value="${task}" onfocusin="highlight(this, true)" onfocusout="highlight(this, false)" onkeyup="handleEdit(event)"/>
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

function highlight(elem, on) {
    let cont = elem.parentElement.parentElement;
    console.log(cont);
    if(on)
        cont.classList.add("highlight");
    else
        cont.classList.remove("highlight");
}

function toggleComplete(elem) {
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
    clonedTask.classList.remove('disappear');
    clonedTask.classList.add('appear');
    deleteTask(elem, true);

    setTimeout(() => {
        let markAll = document.getElementById("mark-all");
        markAll.checked = allTasksCompleted();
    }, 250);
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
}

function allTasksCompleted() {
    let pinnedTasks = document.getElementById("pinned").children;
    let pendingTasks = document.getElementById("pending").children;
    let allCompleted = (pinnedTasks.length === 0) && (pendingTasks.length === 0);

    return allCompleted;
}

function enableDisableControls() {
    let pinned = document.getElementById("pinned");
    let pending = document.getElementById("pending");
    let completed = document.getElementById("completed");

    if(pinned.childElementCount === 0 && pending.childElementCount === 0 && completed.childElementCount === 0) {
        let markAllButton = document.getElementById("mark-all");
        markAllButton.checked = false;
        markAllButton.classList.add("complete");
    }
    if(completed.childElementCount === 0) {
        let deleteAllButton = document.getElementById("delete-all");
        deleteAllButton.classList.add("complete");
    }
}

function deleteTask(elem, move=false) {
    console.log(move);
    let taskObj = getTaskDetails(elem);
    modifyStorage('delete', taskObj);
    if(move) {
        elem.parentElement.parentElement.classList.remove("appear");
        elem.parentElement.parentElement.classList.add("disappear");
        setTimeout(() => {
            elem.parentElement.parentElement.remove();
            enableDisableControls();
        }, 100);
    }
    else {
        elem.parentElement.parentElement.classList.remove("appear");
        elem.parentElement.parentElement.classList.remove("disappear");
        elem.parentElement.parentElement.classList.add("delete");
        setTimeout(() => {
            elem.parentElement.parentElement.remove();
            enableDisableControls();
        }, 500);
    }
}

function deleteAllCompleted() {
    let completed = document.getElementById("completed").children;
    for(let task of completed)
        deleteTask(task.children[2].children[0]);
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
    clonedTask.classList.remove('disappear');
    clonedTask.classList.add('appear');
    deleteTask(elem, true);
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

function handleEdit(event) {
    let elem = event.target;
    let task = elem.value;

    if(task === '')
        deleteTask(elem);
    else {
        let taskObj = getTaskDetails(elem);
        modifyStorage('edit', taskObj);
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