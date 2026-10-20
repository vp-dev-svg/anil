import { test, expect } from '@playwright/test';

test.describe('GameLearn Hub Website Tests', () => {
  
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/GameLearn Hub/);
    await expect(page.locator('h1')).toContainText('Games Seekho');
  });

  test('Navigation links work', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click on Tutorials link
    await page.click('text=Design Tutorials');
    await expect(page).toHaveURL(/tutorials/);
    await expect(page.locator('h1')).toContainText('Game Design Tutorials');
  });

  test('Cheat codes page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/cheats.html');
    await expect(page.locator('h1')).toContainText('Cheat Codes');
    await expect(page.locator('.game-card').first()).toBeVisible();
  });

  test('GTA cheats page loads with platform tabs', async ({ page }) => {
    await page.goto('http://localhost:3000/gta-cheats.html');
    await expect(page.locator('h1')).toContainText('GTA V Cheat');
    
    // Check PC tab is visible
    await expect(page.locator('#pc')).toBeVisible();
    
    // Click PlayStation tab
    await page.click('text=PlayStation');
    await expect(page.locator('#ps')).toBeVisible();
    await expect(page.locator('#pc')).toBeHidden();
  });

  test('Quiz page loads and works', async ({ page }) => {
    await page.goto('http://localhost:3000/quiz.html');
    await expect(page.locator('h1')).toContainText('Game Design Quiz');
    await expect(page.locator('.quiz-option').first()).toBeVisible();
  });

  test('Mini game page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/mini-game.html');
    await expect(page.locator('h1')).toContainText('Memory Card Game');
    await expect(page.locator('.game-card').first()).toBeVisible();
  });

  test('Dark/Light mode toggle works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click theme toggle
    await page.click('#themeToggle');
    
    // Check if light mode class is added
    await expect(page.locator('body')).toHaveClass(/light-mode/);
  });

  test('Newsletter form works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Fill email
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Click subscribe
    await page.click('button:has-text("Subscribe")');
    
    // Wait for message to appear
    await page.waitForFunction(() => {
      const el = document.getElementById('newsletterMsg');
      return el && el.textContent && el.textContent.length > 0;
    }, { timeout: 5000 });
    
    // Check success message
    await expect(page.locator('#newsletterMsg')).toContainText('Subscribe ho gaya');
  });

  test('Progress tracker works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click first progress button
    await page.click('[data-progress="1"]');
    
    // Check progress updated
    await expect(page.locator('#progress1')).toContainText('25%');
  });

  test('Search functionality works', async ({ page }) => {
    await page.goto('http://localhost:3000/cheats.html');
    
    // Type in search
    await page.fill('#cheatSearch', 'GTA');
    
    // Check GTA card is visible
    await expect(page.locator('.game-card').first()).toBeVisible();
  });

  test('PUBG cheats page loads with step-by-step guide', async ({ page }) => {
    await page.goto('http://localhost:3000/pubg-cheats.html');
    await expect(page.locator('h1')).toContainText('PUBG Cheats');
    await expect(page.locator('.guide-step').first()).toBeVisible();
  });

  test('Responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    // Check menu toggle is visible on mobile
    await expect(page.locator('#menuToggle')).toBeVisible();
  });

});
