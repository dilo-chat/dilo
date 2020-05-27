import env from './env'
describe('env', () => {
  it('should load all required environment variables', () => {
    Object.entries(env)
      .forEach(([name, value]) => {
        expect(name).toBeDefined();
        expect(value).toBeDefined();
      })
  })
})
