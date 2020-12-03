import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

const PERMISSIONS = {
  PUBLIC: 0x0,
  NONE: 0x1, // Default for users
  ADMIN: 0x2, // Used to identify someone with access to everything
  MANAGE_ROLES: 0x4,
  MANAGE_MODULES: 0x8,
}

const PERMISSIONS_DESCRIPTIONS = {
  PUBLIC: {
    description: 'Public',
    details: 'No permission someone who is not logged in.',
  },
  NONE: {
    description: 'None',
    details: 'Default permission for logged in user.',
  },
  ADMIN: {
    description: 'Administrator',
    details: 'Users with this permission have every permission.',
  },
  MANAGE_ROLES: {
    description: 'Manage Roles',
    details: 'Users with this permission can create, remove and edit roles.',
  },
  MANAGE_MODULES: {
    description: 'Manage Modules',
    details: 'Users with this permission can manage modules.',
  },
}

declare module 'fastify' {
  interface FastifyInstance {
    PERMISSIONS: typeof PERMISSIONS
    PERMISSIONS_DESCRIPTIONS: typeof PERMISSIONS_DESCRIPTIONS
  }
}

const permissionDecorator: FastifyPluginCallback = (fastify, _, done) => {
  fastify.decorate('PERMISSIONS', PERMISSIONS)
  fastify.decorate('PERMISSIONS_DESCRIPTIONS', PERMISSIONS_DESCRIPTIONS)
  done()
}

export default fp(permissionDecorator, {
  name: 'permission_decorator',
})
