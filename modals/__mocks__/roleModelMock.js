import { vi } from "vitest"

export const RoleCode = {
  USER: "USER",
  ADMIN: "ADMIN",
}

export const RoleModelMock = {
  findOne: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
}

export const RoleModel = RoleModelMock

