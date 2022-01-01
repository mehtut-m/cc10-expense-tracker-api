//Categories

// {
//   id(type: string, format: uuid): "uuid",
//   title(type: string, required): "Transportation",
//   type(type: string, required) : "EXPENSE"
// }

// Read

// GET /transactions
// parameter: none
// response:
// 200 OK {message: "success", transactions: [{id, title, type}]}
// 500 Internal Server Error {message: "Internal Server Error"}

// GET /transactions/:id
// parameter: path {id}
// response:
// 200 OK {message: "success", transaction: {id, title, type}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

// Create

// POST /transactions/
// parameter: body { title, type }
// response:
// 201 Created {message: "success", transaction: {id, title, type}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

// Update

// PUT /transactions/:id
// parameter: body { title, type }
// response:
// 200 OK {message: "success", transaction: {id, title, type}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

// Delete

// DELETE /transactions/:id
// parameter: path { id }
// response:
// 204 No Content {message: "success"}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

//Transactions

// {
//   id(type: string, format: uuid): "uuid",
//   payee(type: string, required): "Transportation",
//   date(type: date, required format: date): "2021-02-21"
//   amount(type:number, required): 200,
//   categoryId:(type:string, format: uuid, required): "uuid"
//   comment:(type: string): "Comment",
// }

// Create

// GET /transactions
// parameter: none
// response:
// 200 OK {message: "success", transactions: [{id, payee, amount, categoryId, comment}]}
// 500 Internal Server Error {message: "Internal Server Error"}

// GET /transactions/:id
// parameter: path { id }
// response:
// 200 OK {message: "success", transaction: {id, payee, amount, categoryId, comment}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

// POST /transactions/
// parameter: body { payee, amount, categoryId, comment }
// response:
// 201 Created {message: "success", transaction: {id, payee, amount, categoryId, comment}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

// PUT /transactions/:id
// parameter: body { payee, amount, categoryId, comment }
// response:
// 200 Created {message: "success", transaction: {id, payee, amount, categoryId, comment}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}

// DELETE /transactions/:id
// parameter: {}
// response:
// 204 no content {message: "success", transaction: {id, payee, amount, categoryId, comment}}
// 400 BadRequest {message: "id is required"}
// 500 Internal Server Error {message: "Internal Server Error"}
