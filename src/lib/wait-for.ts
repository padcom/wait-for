/* eslint-disable no-use-before-define */
/* eslint-disable promise/prefer-await-to-callbacks */

/**
 * Execute a callback every <code>interval</code>ms and if it will not return
 * a truthy value in the <code>timeout<code>ms then throw a Timeout exception.
 * This is a very useful utility that will allow you to specify how often
 * a particular expression should be evaluated and how long will it take to end
 * the execution without success. Great for time-sensitive operations.
 *
 * @param cb callback to call every <code>interval</code>ms. Waiting stops if the callback returns a truthy value.
 * @param params additional parameters
 * @param params.timeout number of milliseconds that need to pass before the Timeout exception is thrown
 * @param params.interval number of milliseconds before re-running the callback
 * @param params.immediate run the callback immediately
 * @returns value returned by the callback
 */
// eslint-disable-next-line max-lines-per-function, complexity
export function waitFor<T>(cb: () => T, {
  timeout = 10000,
  interval = 100,
  immediate = false,
} = {}): Promise<Exclude<T, null | undefined>> {
  return new Promise((resolve, reject) => {
    const timeoutTimer = setTimeout(() => {
      cleanup()
      reject(new Error('Timeout'))
    }, timeout)

    const work = () => {
      try {
        const result = cb()
        if (result !== null) {
          cleanup()
          // @ts-ignore xxx
          resolve(result)
        }
      } catch (error) {
        cleanup()
        reject(error)
      }
    }

    const intervalTimer = setInterval(work, interval)

    const cleanup = () => {
      clearTimeout(timeoutTimer)
      clearInterval(intervalTimer)
    }

    if (immediate) work()
  })
}
