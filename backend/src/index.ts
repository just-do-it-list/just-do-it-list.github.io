import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import db, {flushToFile, Task} from './_db.js';

type changeStatusInput = {
    timeCreated: number;
    newTimeCreated: number;
    newStatus: "PINNED" | "PENDING" | "COMPLETED";
}

const resolvers = {
    Query: {
        tasks() {
            return db.tasks;
        }
    },
    Mutation: {
        addTask(_: any, {newTask}: {newTask:Task}) {
            try {
                db.tasks.push(newTask);
                flushToFile(db);
                return "Added new task";
            }
            catch(e) {
                return `Error ${e.message} while adding task`;
            }
        },
        deleteTask(_: any, {timeCreated}: {timeCreated: number}) {
            try {
                db.tasks = db.tasks.filter(task => task.timeCreated !== timeCreated);
                flushToFile(db);
                return `Deleted task with creation time ${timeCreated}`;
            }
            catch(e) {
                return `Error ${e.message} while deleting task`;
            }
        },
        editTask(_: any, {editedTask}: {editedTask: Task}) {
            try {
                db.tasks = db.tasks.map((task: Task) => task.timeCreated === editedTask.timeCreated ? {...task, ...editedTask} : task);
                flushToFile(db);
                return `Edited task with creation time ${editedTask.timeCreated}`;
            }
            catch(e) {
                return `Error ${e.message} while editing task`;
            }
        },
        changeStatus(_: any, {statusChange}: {statusChange: changeStatusInput}) {
            try {
                db.tasks = db.tasks.map((task: Task) =>
                    task.timeCreated === statusChange.timeCreated
                    ?
                        {
                            timeCreated: statusChange.newTimeCreated,
                            task: task.task,
                            status: statusChange.newStatus
                        }
                    :
                        task
                );
                flushToFile(db);
                return `Edited task with creation time ${statusChange.timeCreated}`;
            }
            catch(e) {
                return `Error ${e.message} while editing task status`;
            }
        },
        deleteCompletedTasks() {
            try {
                db.tasks = db.tasks.filter((task: Task) => task.status !== 'COMPLETED');
                flushToFile(db);
                return `Deleted all completed tasks`;
            }
            catch(e) {
                return `Error ${e.message} while deleting completed tasks`;
            }
        },
        toggleAllComplete() {
            try {
                if(db.tasks.length === db.tasks.filter(task => task.status === "COMPLETED").length)
                    db.tasks = db.tasks.map((task: Task) => ({...task, status: "PENDING"}));
                else
                    db.tasks = db.tasks.map((task: Task) => ({...task, status: "COMPLETED"}));
                flushToFile(db);
                return `Marked all tasks complete`;
            }
            catch(e) {
                return `Error ${e.message} while marking all tasks complete`;
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const startServer = async () => {
    await startStandaloneServer(server, {
        listen: { port: 4000 }
    });
    console.log("Server running at port", 4000);
}

startServer();