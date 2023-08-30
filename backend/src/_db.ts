import * as fs from 'fs';

type Task = {
    timeCreated: number;
    task: string;
    status: "PENDING" | "PINNED" | "COMPLETED";
}

// let tasks: Task[] = [
//     {
//         timeCreated: 1692958727558,
//         task: "Learn Next.js & GraphQL",
//         status: "PINNED"
//     },
//     {
//         timeCreated: 1692958749676,
//         task: "Complete the ToDo App",
//         status: "PINNED"
//     },
//     {
//         timeCreated: 1690457730400,
//         task: "Walk around the building",
//         status: "PENDING"
//     },
//     {
//         timeCreated: 1690802941054,
//         task: "Chill for sometime",
//         status: "PENDING"
//     },
//     {
//         timeCreated: 1692958704326,
//         task: "Eat breakfast",
//         status: "COMPLETED"
//     }
// ];

type db = {
    tasks: Task[];
}

const fetchFromFile = (path: string = '_db.json'): db => {
    try {
        let data = fs.readFileSync(path, 'utf-8');
        let db = JSON.parse(data);
        return db;
    }
    catch(e) {
        console.log(e.message);
        return {tasks: []}
    }
}

export const flushToFile = (db: db, path:string = '_db.json') => {
    try {
        let data = JSON.stringify(db, null, 2);
        fs.writeFileSync(path, data);
    }
    catch(e) {
        console.log(e.message);
    }
}

let db: db = fetchFromFile('_db.json');

export {type Task};
export default db;