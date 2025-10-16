import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { afterAll, beforeAll, beforeEach, vi } from "vitest"
import { RoleModel } from "../modals/role.model.js"

let mongo
console.log("Current ENV:", process.env.NODE_ENV);

beforeAll(async () => {
  // Silence console logs during tests
  console.error = vi.fn()
  console.log = vi.fn()
  console.warn = vi.fn()
  console.info = vi.fn()

  // Start in-memory MongoDB server
//   mongo = await MongoMemoryServer.create()
//   const mongoUri = mongo.getUri()
//   await mongoose.connect(mongoUri)
mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  console.log("Mongo URI:", mongoUri)
  await mongoose.connect(mongoUri)
  console.log("Mongo connected!")
})

// beforeEach(async () => {
//   const collections = await mongoose.connection?.db?.collections()

//   if (!collections) return
//   for (let collection of collections) {
//     await collection.deleteMany({})
//   }

//   // Seed initial role
//   await RoleModel.create({
//     code: "USER",
//     status: true,
//   })
// })
beforeEach(async () => {
  const collections = await mongoose.connection?.db?.collections()

  if (!collections) return
  for (let collection of collections) {
    await collection.deleteMany({})
  }

  const role = await RoleModel.create({
    code: "USER",
    status: true,
  })

  console.log("Seeded role:", role)
})


afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})
