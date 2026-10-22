import { createFileToolHandler } from './src/file-tools.js'

export const inject = ['webServer', 'connection']

export function apply(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/wakamo/file-tools',
    handler: createFileToolHandler(ctx.connection),
  }), 'wakamo: local file conversion and extraction')
}
