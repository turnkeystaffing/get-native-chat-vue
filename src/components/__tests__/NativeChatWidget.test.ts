import { NativeChatVue } from '../../index'

describe('NativeChatWidget smoke test', () => {
  it('should export NativeChatVue plugin', () => {
    expect(NativeChatVue).toBeTruthy()
  })

  it('should have an install method', () => {
    expect(typeof NativeChatVue.install).toBe('function')
  })
})
