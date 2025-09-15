import { describe, it } from 'vitest'

import { waitFor } from './wait-for'

function now() {
  return new Date().getTime()
}

// eslint-disable-next-line max-lines-per-function
describe('waitFor', () => {
  it('will not fail if callback returns immediatelly a truthy value', async ({ expect }) => {
    const ts1 = now()
    const actual = await waitFor(() => 1, {
      immediate: true,
    })
    const ts2 = now()
    expect(actual).toBe(1)
    expect(ts1).toBe(ts2)
  })

  it('will not fail if callback returns a truthy value', async ({ expect }) => {
    const ts1 = now()
    let ts2 = 0
    // eslint-disable-next-line @stylistic/padding-line-between-statements, @stylistic/max-statements-per-line
    const actual = await waitFor(() => { ts2 = now(); return 1 }, {
      timeout: 100,
      interval: 10,
    })
    const ts3 = now()

    expect(actual).toBe(1)
    expect(ts3 - ts1).toBe(10)
    expect(ts2 - ts1).toBe(10)
  })

  it('will fail if not truthy after timeout ms', async ({ expect }) => {
    const promise = waitFor(() => null, { timeout: 100, interval: 10 })
    await expect(promise).rejects.toThrowError()
  })

  it('will fail if callback throws an error', async ({ expect }) => {
    const promise = waitFor(() => { throw new Error() }, { timeout: 100, interval: 10 })
    await expect(promise).rejects.toThrowError()
  })
})
