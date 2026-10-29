# ToSnip

Print Screen, then Ctrl+V. ToSnip gives a CLI or an AI a picture it can open. You do not save the file, and you do not type its name.

The live site is [https://tosnip.com](https://tosnip.com). A picture lasts 5 minutes, then it is deleted. There is no login.

## On this PC

Install once from PowerShell. The command downloads [`public/install.ps1`](public/install.ps1).

```powershell
irm https://tosnip.com/install.ps1 | iex
```

Read the script before you run it:

```powershell
irm https://tosnip.com/install.ps1 | Out-File install.ps1; notepad install.ps1
```

Uninstall:

```powershell
irm https://tosnip.com/uninstall.ps1 | iex
```

Scoop does not include ToSnip in its default bucket. Add this repository, then install:

```powershell
scoop bucket add tosnip https://github.com/tana360/tosnip
scoop install tosnip
```

`scoop uninstall tosnip` stops the helper and deletes the marked pictures in `C:\ToSnip`.

Then press Win + Shift + S, focus CMD, PowerShell, or Windows Terminal, and press Ctrl+V. The helper saves a JPEG in `C:\ToSnip` and types that path. Nothing from this path is uploaded. Instructions are at [https://tosnip.com/tool/](https://tosnip.com/tool/).

## On the web

Open [https://tosnip.com/web/](https://tosnip.com/web/), capture the screen, and press Ctrl+V. ToSnip scales the picture to at most 1000 pixels wide and copies a short link such as `https://tosnip.com/v/xyz123`. Opening the link returns the image file.

In PowerShell, use `curl.exe`:

```powershell
curl.exe -L "https://tosnip.com/v/xyz123" -o shot.png
```

Anyone with the link can open the picture until it expires.

## Develop

Node.js 20 or newer.

```powershell
npm test
npx wrangler dev
npx wrangler deploy
```

The Worker is `src/index.js`. Pages and the install scripts are in `public/`.

## ภาษาไทย

หน้าเว็บอยู่ที่ [https://tosnip.com](https://tosnip.com) วางรูปบนเว็บที่ [https://tosnip.com/web/](https://tosnip.com/web/) ติดตั้งตัวช่วยบน Windows จาก PowerShell ด้วยคำสั่งนี้หนึ่งครั้ง

```powershell
irm https://tosnip.com/install.ps1 | iex
```

อ่านสคริปต์ก่อนรันได้จากไฟล์ [`public/install.ps1`](public/install.ps1) หรือด้วยคำสั่งนี้

```powershell
irm https://tosnip.com/install.ps1 | Out-File install.ps1; notepad install.ps1
```

ถอนการติดตั้งด้วย `irm https://tosnip.com/uninstall.ps1 | iex` วิธีใช้ทั้งหมดอยู่ที่ [https://tosnip.com/tool/](https://tosnip.com/tool/)

ถ้าใช้ Scoop ให้เพิ่มที่เก็บนี้ก่อน แล้วค่อยติดตั้ง

```powershell
scoop bucket add tosnip https://github.com/tana360/tosnip
scoop install tosnip
```

`scoop uninstall tosnip` หยุดตัวช่วยและลบรูปที่มีเครื่องหมายใน `C:\ToSnip`
