export const typeDefs = `#graphql
    type Task {
        timeCreated: Float!
        task: String!
        status: Status!
    }
    enum Status {
        PENDING
        PINNED
        COMPLETED
    }
    type Query {
        tasks: [Task]!
    }
    input AddTaskInput {
        timeCreated: Float!
        task: String!
        status: Status!
    }
    input EditTaskInput {
        timeCreated: Float!
        task: String!
    }
    input ChangeStatusInput {
        timeCreated: Float!
        newTimeCreated: Float!
        newStatus: Status!
    }
    type Mutation {
        addTask(newTask: AddTaskInput!): String!
        deleteTask(timeCreated: Float!): String!
        editTask(editedTask: EditTaskInput!): String!
        changeStatus(statusChange: ChangeStatusInput!): String!
        deleteCompletedTasks(deleteCompleted: Boolean): String!
        toggleAllComplete(toggleAll: Boolean): String!
    }
`;