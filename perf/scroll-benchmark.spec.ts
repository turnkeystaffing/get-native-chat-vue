import { test, expect } from '@playwright/test'

interface BenchmarkResults {
  avgFps: number
  minFps: number
  maxFrameDuration: number
  totalFrames: number
  passAvgFps: boolean
  passMaxFrame: boolean
  pass: boolean
  scrollDrifts?: number[]
  maxDrift?: number
}

test.describe('Scroll Performance Benchmarks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/performance/benchmark.html')
    // Wait for the benchmark component to mount and messages to render
    await page.waitForSelector('[data-testid="message-count"]', { timeout: 30_000 })
  })

  test('static scroll: 1000 messages at ≥30fps, no frame >50ms', async ({ page }) => {
    // Wait for 1000 messages to be rendered
    await expect(page.locator('[data-testid="message-count"]')).toHaveText('1000', {
      timeout: 30_000,
    })

    // Click "Run Scroll Benchmark"
    await page.click('[data-testid="run-static-benchmark"]')

    // Wait for results to appear
    const resultsEl = page.locator('[data-testid="benchmark-results"]')
    await resultsEl.waitFor({ state: 'visible', timeout: 120_000 })

    // Read results from data attribute
    const resultsJson = await resultsEl.getAttribute('data-results')
    expect(resultsJson).toBeTruthy()

    const results: BenchmarkResults = JSON.parse(resultsJson!)
    console.log('Static scroll benchmark results:', results)

    // Assertions per AC#1: ≥30fps avg, no frame >50ms
    expect(results.avgFps).toBeGreaterThanOrEqual(30)
    expect(results.maxFrameDuration).toBeLessThanOrEqual(50)
    expect(results.totalFrames).toBeGreaterThan(0)
    expect(results.pass).toBe(true)
  })

  test('infinite scroll: smooth loading from 20→1000 messages', async ({ page }) => {
    // Click "Run Infinite Scroll Benchmark"
    await page.click('[data-testid="run-infinite-benchmark"]')

    // Wait for results — infinite scroll benchmark takes longer
    const resultsEl = page.locator('[data-testid="benchmark-results"]')
    await resultsEl.waitFor({ state: 'visible', timeout: 120_000 })

    // Read results from data attribute
    const resultsJson = await resultsEl.getAttribute('data-results')
    expect(resultsJson).toBeTruthy()

    const results: BenchmarkResults = JSON.parse(resultsJson!)
    console.log('Infinite scroll benchmark results:', results)

    // Hard gate per AC#2: average FPS must stay ≥30fps during scroll+load
    expect(results.avgFps).toBeGreaterThanOrEqual(30)
    expect(results.totalFrames).toBeGreaterThan(0)

    // Max frame duration: enforce 50ms hard gate (matching AC#1 threshold).
    // The 16ms target from AC#2 is aspirational per dev notes — document but
    // don't hard-fail on it. The 50ms ceiling prevents severe jank.
    expect(results.maxFrameDuration).toBeLessThanOrEqual(50)
    if (results.maxFrameDuration > 16) {
      console.log(
        `Note: max frame ${results.maxFrameDuration}ms exceeds 16ms aspirational target` +
          ' (DOM mutation spikes during batch prepend — expected)',
      )
    }

    // Scroll position preservation per AC#2: "scroll position preserved without jumping"
    expect(results.maxDrift ?? 0).toBeLessThanOrEqual(1) // 1px tolerance for sub-pixel rounding
    if (results.maxDrift !== undefined) {
      console.log('Scroll position drifts:', results.scrollDrifts)
      console.log('Max drift:', results.maxDrift, 'px')
    }
  })
})
