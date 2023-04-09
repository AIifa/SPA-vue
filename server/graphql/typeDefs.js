module.exports.typeDefs = `
    type Task {
      id: Int!
      title: String
      subTaskList: [String]
      performedList: [Boolean]
    }
  
    type Data {
        taskList: [Task!]!
        count: Int!
    }

    type Query {
      data: Data
      example: [Task]
      getList: Data
    }

    input InputTask {
        id: Int!
        title: String!
        subTaskList: [String]
        performedList: [Boolean]
    }

    type Res{
        res: String
    }

    type Mutation {
        updateTask(task: InputTask, id: [Int]): Res
        insertTask(id: Int!, title: String!): Res
        deleteTask(id: Int!): Res
    }
  `