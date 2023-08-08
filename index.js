window.onload = () => {
    const cats = ["pinned", "pending", "completed"];
    for(let cat of cats) {
        let tasks = localStorage.getItem(cat);
        if(tasks !== null && tasks !== "{}") {
            let cont = document.getElementById(cat);
            tasks = JSON.parse(tasks);
            let entries = (
                cat === "pinned" ?
                Object.entries(tasks).reverse() :
                Object.entries(tasks)
            );

            for(let [taskID, task] of entries) {
                cont.insertAdjacentHTML("beforeend",`
                    <div class="task" data-taskid="${taskID}">
                        <div class="control-button">
                            <input
                                onclick="toggleComplete(this)"
                                type="checkbox"
                                ${cat === "completed" ? "checked" : ""}
                                title="Mark as complete"
                            />
                        </div>
                        <div class="task-name">
                            <input
                                type="text"
                                value="${task}"
                                onfocusin="highlight(this, true)"
                                onfocusout="highlight(this, false)"
                                onkeyup="handleEdit(event)"
                            />
                        </div>
                        <div class="control-button">
                            <i
                                onclick="deleteTask(this)"
                                class="fa-solid fa-xmark"
                            ></i>
                        </div>
                        <div class="control-button">
                            <i
                                onclick="togglePin(this)"
                                class="fa-solid fa-thumbtack"
                            ></i>
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
    let inputText = document.getElementById("new-task");
    let task = inputText.value;
    let plusIcon = inputText.parentElement.parentElement.children[0];

    if(task === "")
        addClass(plusIcon, "complete");
    else
        removeClass(plusIcon, "complete");

    if(
        (event.key === undefined || event.key === "Enter") &&
        task !== ""
    ) {
        let markAll = document.getElementById("mark-all");
        removeClass(markAll, "complete");
        markAll.checked = false;

        let cont = document.getElementById("pending");
        let taskID = (new Date()).getTime();
        cont.insertAdjacentHTML("beforeend",`
            <div class="task" data-taskid="${taskID}">
                <div class="control-button">
                    <input
                        onclick="toggleComplete(this)"
                        type="checkbox"
                        title="Mark as complete"
                    />
                </div>
                <div class="task-name">
                    <input
                        type="text"
                        value="${task}"
                        onfocusin="highlight(this, true)"
                        onfocusout="highlight(this, false)"
                        onkeyup="handleEdit(event)"
                    />
                </div>
                <div class="control-button">
                    <i
                        onclick="deleteTask(this)"
                        class="fa-solid fa-xmark"
                    ></i>
                </div>
                <div class="control-button">
                    <i
                        onclick="togglePin(this)"
                        class="fa-solid fa-thumbtack"
                    ></i>
                </div>
            </div>`
        );
        let taskElem = cont.lastChild;
        addClass(taskElem, "appear");
        setTimeout(() => {
            removeClass(taskElem, "appear");
        }, 400);
        modifyStorage("add", {taskID, task, taskType: "pending"});

        inputText.value = "";
        addClass(plusIcon, "complete");
    }
}

function addClass(elem, className) {
    elem.classList.add(className);
}

function removeClass(elem, className) {
    elem.classList.remove(className);
}

function isEmpty(elem) {
    return elem.childElementCount === 0;
}

function highlight(elem, on) {
    let cont = elem.parentElement.parentElement;
    if(on)
        addClass(cont, "highlight");
    else
        removeClass(cont, "highlight");
}

function toggleComplete(elem) {
    let task = elem.parentElement.parentElement;
    let clonedTask = task.cloneNode(true);
    let deleteAllButton = document.getElementById("delete-all");
    let taskObj = getTaskDetails(elem);
    let cont;

    if(elem.checked) {
        cont = document.getElementById("completed");
        removeClass(deleteAllButton, "complete");
        modifyStorage("markcomplete", taskObj);
        clonedTask.onkeydown = () => false;
    }
    else {
        cont = document.getElementById("pending");
        modifyStorage("markincomplete", taskObj);
        clonedTask.onkeydown = null;
    }

    cont.insertAdjacentElement("beforeend", clonedTask);
    removeClass(clonedTask, "disappear");
    addClass(clonedTask, "appear");
    deleteTask(elem, true);

    setTimeout(() => {
        let markAll = document.getElementById("mark-all");
        markAll.checked = allTasksCompleted();
    }, 400);

    setTimeout(() => {
        removeClass(clonedTask, "appear");
    }, 400);
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
    let pinnedTasks = document.getElementById("pinned");
    let pendingTasks = document.getElementById("pending");
    let allCompleted = isEmpty(pinnedTasks) && isEmpty(pendingTasks);

    return allCompleted;
}

function enableDisableControls() {
    let pinned = document.getElementById("pinned");
    let pending = document.getElementById("pending");
    let completed = document.getElementById("completed");

    if(isEmpty(pinned) && isEmpty(pending) && isEmpty(completed)) {
        let markAllButton = document.getElementById("mark-all");
        markAllButton.checked = false;
        addClass(markAllButton, "complete");
    }
    if(isEmpty(completed)) {
        let deleteAllButton = document.getElementById("delete-all");
        addClass(deleteAllButton, "complete");
    }
}

function deleteTask(elem, move=false) {
    let taskObj = getTaskDetails(elem);
    modifyStorage("delete", taskObj);
    if(move) {
        removeClass(elem.parentElement.parentElement, "appear");
        addClass(elem.parentElement.parentElement, "disappear");
        setTimeout(() => {
            elem.parentElement.parentElement.remove();
            enableDisableControls();
        }, 400);
    }
    else {
        removeClass(elem.parentElement.parentElement, "appear");
        removeClass(elem.parentElement.parentElement, "disappear");
        addClass(elem.parentElement.parentElement, "delete");
        setTimeout(() => {
            elem.parentElement.parentElement.remove();
            enableDisableControls();
        }, 600);
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
        modifyStorage("pin", taskObj);
    }
    else {
        cont = document.getElementById("pending");
        modifyStorage("unpin", taskObj);
    }

    cont.insertAdjacentElement("afterbegin", clonedTask);
    removeClass(clonedTask, "disappear");
    addClass(clonedTask, "appear");
    deleteTask(elem, true);

    setTimeout(() => {
        removeClass(clonedTask, "appear");
    }, 400);
}

function isPinned(elem) {
    let container =  elem.parentElement.parentElement.parentElement;
    return container.id === "pinned";
}

function filter(elem) {
    let buttons = document.getElementsByTagName("button");
    for(let button of buttons)
        removeClass(button, "button-active");
    addClass(elem, "button-active");

    let pinned = document.getElementById("pinned");
    let pending = document.getElementById("pending");
    let completed = document.getElementById("completed");

    if(elem.innerText === "Pinned") {
        removeClass(pinned, "hide-elm");
        addClass(pending, "hide-elm");
        addClass(completed, "hide-elm");
    }
    else if(elem.innerText === "Pending") {
        addClass(pinned, "hide-elm");
        removeClass(pending, "hide-elm");
        addClass(completed, "hide-elm");
    }
    else if(elem.innerText === "Completed") {
        addClass(pinned, "hide-elm");
        addClass(pending, "hide-elm");
        removeClass(completed, "hide-elm");
    }
    else {
        removeClass(pinned, "hide-elm");
        removeClass(pending, "hide-elm");
        removeClass(completed, "hide-elm");
    }
}

function handleEdit(event) {
    let elem = event.target;
    let task = elem.value;

    if(task === "")
        deleteTask(elem);
    else {
        let taskObj = getTaskDetails(elem);
        modifyStorage("edit", taskObj);
    }
}

function getTaskDetails(elem) {
    let taskElm = elem.parentElement.parentElement;
    let taskID = taskElm.getAttribute("data-taskid");
    let taskType = taskElm.parentElement.id;
    let task = taskElm.children[1].children[0].value;
    return {taskID, task, taskType};
}

function getItemFromLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name) || "{}");
}

function setItemInLocalStorage(name, value) {
    return localStorage.setItem(name, JSON.stringify(value));
}

function modifyStorage(action, taskObj) {
    let {taskID, task, taskType} = taskObj;
    if(action === "add" || action === "unpin" || action === "markincomplete") {
        let pending = getItemFromLocalStorage("pending");
        pending[taskID] = task;
        setItemInLocalStorage("pending", pending);
    }
    else if(action === "delete") {
        let tasks = getItemFromLocalStorage(taskType);
        delete tasks[taskID];
        setItemInLocalStorage(taskType, tasks);
    }
    else if(action === "edit") {
        let tasks = getItemFromLocalStorage(taskType);
        tasks[taskID] = task;
        setItemInLocalStorage(taskType, tasks);
    }
    else if(action === "pin") {
        let pinned = getItemFromLocalStorage("pinned");
        pinned[taskID] = task;
        setItemInLocalStorage("pinned", pinned);
    }
    else if(action === "markcomplete") {
        let completed = getItemFromLocalStorage("completed");
        completed[taskID] = task;
        setItemInLocalStorage("completed", completed);
    }
}