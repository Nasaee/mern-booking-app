import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL = 'http://localhost:5173/';

test.beforeEach(async ({ page }) => {
  //  Login
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole('link', { name: 'Sign In' }).click();

  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await page.locator('[name=email]').fill('nasaee.dev@gmail.com');
  await page.locator('[name=password]').fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Sign in Successful!')).toBeVisible();
});

test('should allow user to add a hotel', async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill('Dublin Getaways');
  await page.locator('[name="city"]').fill('Dublin');
  await page.locator('[name=country]').fill('Ireland');
  await page
    .locator('[name=description]')
    .fill(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultricies sodales rhoncus. Mauris nisl sapien, interdum vitae mi et, porttitor faucibus velit. Duis quis nisl feugiat, volutpat leo a, efficitur lectus. Praesent vulputate turpis nec sapien vulputate tincidunt. Maecenas vitae aliquam ipsum. Ut ultricies hendrerit ante eget vehicula. Cras sit amet semper odio. Pellentesque lacinia, sapien a tristique ultrices, augue diam interdum nulla, non porttitor ligula nisl at nibh. Aenean in lobortis velit, sed hendrerit mi. Nam leo sem, laoreet quis diam eget, euismod lobortis purus. Aenean laoreet dui vel diam pulvinar viverra.'
    );
  await page.locator('[name=pricePerNight]').fill('1200');
  await page.selectOption('select[name=starRating]', '5');

  await page.getByText('All Inclusive').check();

  await page.getByLabel('Free Wifi').check();

  await page.locator('[name=adultCount]').fill('2');
  await page.locator('[name=childCount]').fill('4');

  await page.setInputFiles('[name=imageFiles]', [
    path.join(__dirname, 'files', '1.jpg'),
    path.join(__dirname, 'files', '2.jpg'),
  ]);

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Hotel Saved!')).toBeVisible();
});

test('should display hotels', async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText('Dublin Getaways')).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit amet')).toBeVisible();
  await expect(page.getByText('Dublin, Ireland')).toBeVisible();
  await expect(page.getByText('All Inclusive')).toBeVisible();
  await expect(page.getByText('฿1200 per night')).toBeVisible();
  await expect(page.getByText('2 adults, 4 children')).toBeVisible();
  await expect(page.getByText('5 Star Rating')).toBeVisible();

  await expect(
    page.getByRole('link', { name: 'View Details' }).first()
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add Hotel' })).toBeVisible();
});
