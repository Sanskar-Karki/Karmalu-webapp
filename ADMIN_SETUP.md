# KARMALU Admin — Setup Guide

This guide takes the admin panel from "built" to "fully working": you'll be able to sign in,
edit products, upload photos and videos, and see changes on the live shop.

Work through the steps **in order**. Each step ends with a **✅ Check** so you know it worked
before moving on. Total time: about 30–45 minutes.

---

## What you'll need

| Account | Cost | Used for |
|---------|------|----------|
| [Supabase](https://supabase.com) | Free plan is enough | Products database, admin logins, website orders |
| [Cloudinary](https://cloudinary.com) | Free plan is enough | Storing photos and videos |
| Your code editor (VS Code) | — | Editing the `.env.local` settings file |

All settings live in one file: **`karmalu/.env.local`**. It is private and is never uploaded to
GitHub. Never share its contents.

---

## Step 1 — Get your Supabase project working

The Supabase address currently in `.env.local` no longer responds, which means the project was
**paused** (free projects pause after about a week without use) or **deleted**. Until this is
fixed, the admin can't sign in **and website orders are not being saved**.

1. Go to <https://supabase.com/dashboard> and sign in.
2. Look for your KARMALU project in the list.
   - **If it shows "Paused"** → open it and click **Restore project**. Wait until it says it's
     healthy (a few minutes). Continue to step 3.
   - **If there's no project** → click **New project**, name it `karmalu`, choose the region
     closest to Nepal (e.g. *Mumbai / ap-south-1* or *Singapore*), set a database password and
     **save that password somewhere safe**. Wait for it to finish creating.
3. In the project, open **Project Settings → API Keys** (older dashboards: **Settings → API**).
4. Copy these two values:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
     (also shown under **Project Settings → Data API**).
   - **Publishable key** — starts with `sb_publishable_…`
     (older dashboards call it the **anon public** key; that works too).
5. Open `karmalu/.env.local` and set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijkl.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
   ```
   Replace the old values completely. No quotes, no spaces around `=`.

> ⚠️ Never copy the **secret** / **service_role** key into this file. The site doesn't need it.

**✅ Check:** paste your Project URL into a browser and add `/rest/v1/` to the end. You should
see a short message (e.g. "No API key found") — **not** "This site can't be reached".

---

## Step 2 — Create the database tables

1. In Supabase, open **SQL Editor** (left sidebar) → **New query**.
2. **Only if this is a new project** (you created it in Step 1): open
   `karmalu/supabase/orders.sql` in VS Code, copy everything, paste it into the SQL editor and
   click **Run**. This sets up website orders.
3. Click **New query** again. Open `karmalu/supabase/catalog.sql`, copy everything, paste it,
   and click **Run**.
   - If Supabase warns about "destructive operations", that's because of the `drop policy if
     exists` lines — they're safe. Click **Run this query**.

**✅ Check:** open **Table Editor**. You should see `catalog_products`, `catalog_categories`,
`media_assets` and `admin_users` (plus `orders`).

---

## Step 3 — Create your admin login

1. In Supabase, go to **Authentication → Users → Add user → Create new user**.
2. Enter your email and a strong password. Tick **Auto Confirm User**. Click **Create user**.
3. Go to **SQL Editor → New query**, paste this (with **your** email), and click **Run**:
   ```sql
   insert into public.admin_users (email) values ('you@example.com');
   ```
4. Recommended — stop strangers creating accounts: **Authentication → Sign In / Providers**
   (older dashboards: **Authentication → Providers → Email**) and turn **off**
   **Allow new users to sign up**. You'll still be able to add staff yourself in step 1.

> Only emails listed in `admin_users` can change anything. Even if someone else had an account,
> the database itself refuses their edits.

**✅ Check:** in **Table Editor → admin_users** you can see your email.

---

## Step 4 — Connect Cloudinary (photo & video uploads)

1. Sign up at <https://cloudinary.com> (free plan).
2. In the Cloudinary console, open **Settings (⚙️) → API Keys**
   (or the **Dashboard** home, which shows the same details).
3. Copy:
   - **Cloud name** — e.g. `dxyz12345`
   - **API Key** — a long number
   - **API Secret** — click the eye icon to reveal it
4. In `karmalu/.env.local`, fill in the three lines that are already there:
   ```
   CLOUDINARY_CLOUD_NAME=dxyz12345
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdEFGHijklMNOPqrst
   ```

> The API Secret only ever stays on the server. The browser gets a one-time signature per
> upload, never the secret itself.

**✅ Check:** all three lines have a value after the `=`.

---

## Step 5 — Restart the site

Settings in `.env.local` are only read when the site starts.

1. In the VS Code terminal that's running the site, press **Ctrl + C** to stop it.
2. Make sure you're in the `karmalu` folder, then start it again:
   ```
   npm run dev
   ```
3. Wait for **"Ready"**, then open <http://localhost:3000>.

**✅ Check:** the shop loads normally.

---

## Step 6 — Sign in and import your products

1. Open <http://localhost:3000/admin> and sign in with the email and password from Step 3.
2. You'll land on **Products**, showing "No products in the database yet".
3. Click **Import current products**. This copies every product and category that's currently
   built into the code into the database. (Safe to click again later — it never overwrites
   products you've edited.)

**✅ Check — the important one:**
1. In the admin, open any published product, change its price (e.g. add 1), and click **Save**.
2. Open that product on the shop (the **View on site ↗** button) and refresh.
3. The new price should appear within a few seconds. Change it back afterwards.

If the shop still shows the old price, see **Troubleshooting** below.

---

## Step 7 — Test uploads

1. In the admin, go to **Photos & videos**.
2. Drag a photo onto the upload box (or click it and choose a file).
3. Watch the progress bar finish and the photo appear in the grid.
4. Open a product → **+ Add photos or videos** → select your new photo → **Add** → **Save**.

**✅ Check:** the photo appears in the product's gallery on the shop.

🎉 **The admin is now fully working on your computer.**

---

## Step 8 — Going live (when you deploy the website)

Your hosting provider (e.g. Vercel) doesn't read your `.env.local` file, so the settings must
be added there too.

1. **Test a production build first.** Stop the dev server (**Ctrl + C**), then run:
   ```
   npm run build
   ```
   It must finish without errors. (Don't run this while `npm run dev` is running — it breaks
   the dev server's styling. If that ever happens: stop the server, delete the `karmalu/.next`
   folder, and run `npm run dev` again.)
2. In your hosting dashboard (Vercel: **Project → Settings → Environment Variables**), add
   every one of these with the same values as `.env.local`:

   | Name | What it is |
   |------|------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for orders, digits only (e.g. `9779768990584`) |
   | `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | Cloudinary API secret |
   | `NEXT_PUBLIC_SITE_URL` | Your real web address, e.g. `https://karmalu.com` (used for Google's sitemap) |

3. Redeploy the site so it picks up the new settings.
4. Repeat the **Step 6 check** on the live site: `https://your-site/admin`.

> **Keep Supabase awake:** free projects pause after ~7 days with no activity. A live shop with
> visitors keeps it active. If the shop is quiet for a while and the admin stops working,
> come back to Step 1 and click **Restore**. (The paid plan never pauses.)

---

## Everyday use

| I want to… | Do this |
|------------|---------|
| **Add a product** | Products → **+ Add product** → fill in details → add photos → **Save & publish** (or **Save** to keep it as a hidden draft). |
| **Edit a product** | Products → click its name → change things → **Save**. The shop updates within seconds. |
| **Hide a product for now** | Open it → Status **Draft** → Save (or click **Unpublish** in the list). |
| **Remove a product** | Click **Archive** in the list. It disappears from the shop but is kept for your order records. |
| **Delete a product forever** | Status filter → **Archived** → **Delete** → **Confirm delete**. |
| **Fill in the size chart** | In the product form, select the **Sizes** — each one gets its own row in the **Size chart** automatically (deselecting a size removes its row; re-selecting brings its numbers back). Rename a column by typing in its header, add one with **+**, remove one with **✕**, move it with **← →**, or new charts start with **Chest · Length · Sleeves**; or pick a preset (**Tops**, **Bottoms**, **Chest · Waist · Hip**). New charts are in **inches** (switch to **cm** with the in / cm toggle above the chart — it converts the numbers). Empty boxes show "—" to shoppers, who see inches first and can switch to cm. |
| **Put something on sale** | Open the product → type a **Discount %** (e.g. `20`). The sale price is worked out for you, the old price is shown crossed out, and the badge becomes **Sale**. The green "Shoppers see" box previews it. **Remove discount** puts it back to full price. |
| **See everything on sale** | Products → status filter → **On sale**. |
| **Change the order of products in the shop** | **Display order → All products** → choose the shop → drag products (or ↑ ↓ / Top / Bottom) → **Save order**. This is the order shoppers see under **All** and inside each category. They can still sort by price. New products are added at the end. |
| **Choose what shows in "New Arrivals"** | First give the products the **New** badge (edit product → **Badge → New** → Save). Then **Display order → New Arrivals** → choose the shop → **+ Add** them from the "Products tagged New" list → drag them (or ↑ / ↓) into order → **Save order**. Up to 12. On Originals the first one also appears on the hero's "Just dropped" card. On Living & Decor this controls "Featured this season". Changing a product's badge away from **New** removes it from the section automatically. **Clear (go automatic)** hands it back to the shop. *(First time only: run `supabase/home_picks.sql` in the Supabase SQL editor — the New Arrivals screen will remind you.)* |
| **Add a category** | **Display order → Categories** → choose the shop → **+ Add category** → name, tagline and a photo → **Add category**. It appears in the menu, filters and home page straight away. |
| **Rename a category / change its photo** | Categories → **Edit**. |
| **Change category order** | Categories → **↑ / ↓**. This is the order in the menu, filters and home page. |
| **Delete a category** | Categories → **Delete**. If products use it, choose a category to move them to first. A shop always keeps at least one category. |
| **Copy a similar product** | Click **Duplicate** — you get a hidden draft copy to edit. |
| **Change photo order** | Drag photos in the product form (or use ← →). The **first photo is the main one.** |
| **Set the hover photo** | Hover a photo in the product form → **Use on hover**. Shown when shoppers hover the product card. |
| **Upload many files** | Photos & videos → drop several files at once. Photos ≤ 10 MB, videos ≤ 100 MB. |
| **Delete a photo/video** | Photos & videos → **Delete** → **Confirm**. If a product still uses it, you'll be told which one — remove it there first. |

**Rules the admin enforces for you:** a product needs at least one photo before it can be
published; the sale price must be lower than the original price; two products in the same shop
can't share a URL name.

---

## Adding or removing staff

**Add someone:**
1. Supabase → **Authentication → Users → Add user** (their email + a password, tick
   **Auto Confirm User**).
2. SQL Editor:
   ```sql
   insert into public.admin_users (email) values ('staff@example.com');
   ```
3. Send them the address `/admin` and their password.

**Remove someone:**
```sql
delete from public.admin_users where email = 'staff@example.com';
```
Then also delete their user under **Authentication → Users**.

---

## Troubleshooting

| Problem | Cause & fix |
|---------|-------------|
| **"That email and password don't match an account."** | Wrong password, or the user wasn't created in Step 3. Reset it under **Authentication → Users → ⋯ → Reset password** (or delete and re-add the user with **Auto Confirm**). |
| **"This account doesn't have admin access."** | The email isn't in `admin_users`, or is spelled differently. Re-run the insert from Step 3 with the exact email. |
| **Admin shows "Couldn't load products from the database"** | `catalog.sql` wasn't run (Step 2), or Supabase is paused (Step 1). |
| **"Can't reach the database…"** on sign-in | Supabase URL or key in `.env.local` is wrong, the project is paused (Step 1), or you didn't restart after editing `.env.local` (Step 5). |
| **Photos & videos says "Uploads aren't set up yet"** | Cloudinary values missing in `.env.local` (Step 4), or the site wasn't restarted. |
| **Upload fails with "Invalid Signature"** | The API Secret doesn't match the API Key. Copy both again from the same Cloudinary key. |
| **Shop still shows old products after saving** | Check the product's status is **Published**. Refresh the shop page. If the database can't be reached the shop quietly shows the products built into the code — check Step 1. |
| **Live site works locally but not online** | The hosting provider is missing environment variables (Step 8, part 2), or wasn't redeployed after adding them. |
| **Website styling disappeared while working locally** | `npm run build` was run while `npm run dev` was running. Stop the server, delete `karmalu/.next`, run `npm run dev`. |

---

## Good to know (current limits)

- **Videos** attached to a product play on its product page (muted, looping), in the order you
  set. The first item should be a **photo** — it's the one used on product cards.
- A category's **URL name** (e.g. `/originals/jacket`) can't be changed after it's created, so
  shared links and Google results keep working. Its display name, tagline and photo can.
- **Orders** aren't shown in this admin yet. They're saved in Supabase **Table Editor → orders**.
- The admin is in English and works on phones, but is most comfortable on a laptop.

For developers: how the code is organised is in [`claude/07_admin.md`](claude/07_admin.md).
