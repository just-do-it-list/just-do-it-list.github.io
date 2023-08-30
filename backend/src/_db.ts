type Task = {
    timeCreated: number;
    task: string;
    status: "PENDING" | "PINNED" | "COMPLETED";
}

let tasks: Task[] = [
    {
        timeCreated: 1692958727558,
        task: "Learn Next.js & GraphQL",
        status: "PINNED"
    },
    {
        timeCreated: 1692958749676,
        task: "Complete the ToDo App",
        status: "PINNED"
    },
    {
        timeCreated: 1690457730400,
        task: "Walk around the building",
        status: "PENDING"
    },
    {
        timeCreated: 1690802941054,
        task: "Chill for sometime",
        status: "PENDING"
    },
    {
        timeCreated: 1692958704326,
        task: "Eat breakfast",
        status: "COMPLETED"
    }
];

type db = {
    tasks: Task[];
}

let db: db = { tasks };

export {type Task};
export default db;