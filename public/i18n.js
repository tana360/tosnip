(function () {
  const phrases = {
    skip: ["Skip to content", "ข้ามไปเนื้อหา"],
    navLabel: ["Parts of the system", "ส่วนของระบบ"],
    navHome: ["Home", "หน้าแรก"],
    navWeb: ["On the web", "วางบนเว็บ"],
    navTool: ["On this PC", "เครื่องมือในเครื่อง"],
    navWhy: ["The problem", "ปัญหา"],
    langLabel: ["Language", "ภาษา"],
    navToggle: ["Menu", "เมนู"],

    metaHome: [
      "Print Screen, then Ctrl+V. ToSnip places the picture where an AI in PowerShell, CMD, or a CLI can open it. You do not save the file, and you do not type its name.",
      "Print Screen แล้ว Ctrl+V ToSnip วางรูปให้ AI ใน PowerShell, CMD หรือ CLI เปิดดูได้ ไม่ต้องบันทึกไฟล์ และไม่ต้องพิมพ์ชื่อรูป",
    ],
    titleHome: ["ToSnip · Print Screen, then Ctrl+V", "ToSnip · Print Screen แล้ว Ctrl+V"],
    problemLabel: ["Why ToSnip", "ทำไมต้องใช้ ToSnip"],
    problemTitle: ["Why the screenshot never reaches the CLI", "ทำไมรูปแคปถึงไปไม่ถึง CLI"],
    problemSub: [
      "You captured the screen so an AI could look at it. A terminal still needs a file it can open.",
      "คุณแคปหน้าจอเพื่อให้ AI ดู แต่เทอร์มินัลต้องมีไฟล์ที่เปิดได้",
    ],
    problem1k: ["The problem", "ปัญหา"],
    problem1h: ["A clipboard picture has nowhere to go", "รูปบนคลิปบอร์ดไปต่อไม่ได้"],
    problem1p: [
      "Print Screen and Win + Shift + S leave the picture on the clipboard. PowerShell, CMD, and an AI CLI cannot open that. Saving the file means you choose a name and type the path. A chat label such as [Image #1] is only the index of a picture in that message.",
      "กด Print Screen หรือ Win + Shift + S แล้วรูปอยู่บนคลิปบอร์ด PowerShell, CMD และ AI CLI เปิดรูปนั้นไม่ได้ การบันทึกเองต้องตั้งชื่อไฟล์แล้วพิมพ์เส้นทาง ป้าย [Image #1] ในแชตเป็นลำดับของรูปในข้อความนั้น",
    ],
    problem2k: ["What ToSnip fixes", "ToSnip แก้ตรงนี้"],
    problem2h: ["Ctrl+V gives the AI something it can open", "Ctrl+V แล้ว AI มีไฟล์ให้เปิด"],
    problem2p: [
      "In Windows Terminal, PowerShell, or CMD, Ctrl+V types a path in C:\\ToSnip. On the web, the same paste copies a short link any CLI can open. The picture lasts 5 minutes, then it is deleted.",
      "ใน Windows Terminal, PowerShell หรือ CMD กด Ctrl+V แล้วเส้นทางใน C:\\ToSnip ถูกพิมพ์ให้ บนเว็บ การวางเดียวกันคัดลอกลิงก์สั้นที่ CLI ใดก็เปิดได้ รูปอยู่ได้ 5 นาที แล้วถูกลบเอง",
    ],
    problemMore: ["Read the full explanation", "อ่านคำอธิบายทั้งหมด"],
    homeEyebrow: ["For developers and everyone else", "สำหรับนักพัฒนาและคนทั่วไป"],
    homeH1: ["Print Screen. Ctrl+V. The AI sees the picture.", "Print Screen แล้ว Ctrl+V ให้ AI เห็นรูป"],
    homeLead: [
      "You do not save the picture, and you do not type which file it is. Press <span class=\"keys\"><kbd>Print Screen</kbd></span> or <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span>, then <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span>. In PowerShell, CMD, or Windows Terminal the path is typed for you. Online, nothing is installed, the link can be shared, and the picture deletes itself.",
      "ไม่ต้องบันทึกรูป และไม่ต้องพิมพ์ว่าเป็นไฟล์ไหน กด <span class=\"keys\"><kbd>Print Screen</kbd></span> หรือ <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> แล้วกด <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> ใน PowerShell, CMD หรือ Windows Terminal เส้นทางจะถูกพิมพ์ให้ แบบออนไลน์ไม่ต้องติดตั้ง แชร์ลิงก์ได้ และรูปถูกลบเอง",
    ],
    audDev: ["Developers", "นักพัฒนา"],
    audEveryone: ["Everyone", "คนทั่วไป"],
    audPs: ["PowerShell", "PowerShell"],
    audCmd: ["CMD", "CMD"],
    audCli: ["CLI", "CLI"],
    productsLabel: ["Two ways to hand the picture to an AI", "สองทางในการส่งรูปให้ AI"],
    mockWeb: ["After a paste on the web", "ตัวอย่างหลังวางรูปบนเว็บ"],
    webCardH: ["Online", "ออนไลน์"],
    webFit: [
      "Easy, even with nothing installed. Share the short link with a person or an AI. The picture deletes itself after 5 minutes.",
      "ใช้ง่ายแม้ไม่ต้องติดตั้ง แชร์ลิงก์สั้นให้คนหรือ AI ได้ รูปถูกลบเองเมื่อครบ 5 นาที",
    ],
    webLi1: ["Open the page and paste. There is nothing to install.", "เปิดหน้านี้แล้ววางรูป ไม่ต้องติดตั้งอะไร"],
    webLi2: ["The short link is copied and ready to share.", "ลิงก์สั้นถูกคัดลอก พร้อมแชร์"],
    webLi3: ["After 5 minutes the picture deletes itself.", "ครบ 5 นาที รูปถูกลบเอง"],
    webLi4: ["Anyone with the link can view the picture for 5 minutes", "ใครมีลิงก์จะเห็นรูปได้ 5 นาที"],
    webCta: ["Use it online", "ใช้แบบออนไลน์"],
    mockTool: ["After Ctrl+V in CMD", "ตัวอย่างหลังกด Ctrl+V ใน CMD"],
    toolFit: [
      "Use this in PowerShell, CMD, or Windows Terminal. Ctrl+V types the path so the AI in that window can open the file. The picture stays on this PC.",
      "ใช้ใน PowerShell, CMD หรือ Windows Terminal กด Ctrl+V แล้วเส้นทางถูกพิมพ์ให้ AI ในหน้าต่างนั้นเปิดไฟล์ได้ รูปอยู่บนเครื่องนี้",
    ],
    toolLi1: ["Install once from PowerShell", "ติดตั้งจาก PowerShell ครั้งเดียว"],
    toolLi2: ["Print Screen, then Ctrl+V on the command line", "กด Print Screen แล้ว Ctrl+V ในบรรทัดคำสั่ง"],
    toolLi3: ["A path in C:\\ToSnip is typed for you. You do not choose the file name.", "เส้นทางใน C:\\ToSnip ถูกพิมพ์ให้ ไม่ต้องตั้งชื่อไฟล์เอง"],
    toolLi4: ["Nothing is uploaded to the web", "ไม่มีการอัปโหลดขึ้นเว็บ"],
    toolCta: ["See how to install", "ดูวิธีติดตั้ง"],
    flowTitle: ["Print Screen, then Ctrl+V", "Print Screen แล้ว Ctrl+V"],
    flowSub: [
      "The picture reaches an AI in PowerShell, CMD, or any CLI. You do not save it yourself, and you do not say which file it is.",
      "รูปไปถึง AI ใน PowerShell, CMD หรือ CLI ใดก็ได้ ไม่ต้องบันทึกเอง และไม่ต้องบอกว่าเป็นไฟล์ไหน",
    ],
    flow1h: ["Capture", "จับภาพ"],
    flow1p: [
      "Press Print Screen for the whole screen, or Win + Shift + S and drag over one area. The picture lands on the clipboard. You do not save a file.",
      "กด Print Screen เพื่อทั้งหน้าจอ หรือ Win + Shift + S แล้วลากครอบส่วนที่ต้องการ รูปเข้าคลิปบอร์ด ไม่ต้องบันทึกไฟล์",
    ],
    flow2h: ["Ctrl+V", "Ctrl+V"],
    flow2p: [
      "In PowerShell, CMD, or Windows Terminal the path is typed at the cursor. On the web, the link is copied. You do not type a file name.",
      "ใน PowerShell, CMD หรือ Windows Terminal เส้นทางถูกพิมพ์ที่เคอร์เซอร์ บนเว็บลิงก์ถูกคัดลอกให้ ไม่ต้องพิมพ์ชื่อไฟล์",
    ],
    flow3h: ["The AI looks", "AI เห็นรูป"],
    flow3p: [
      "The CLI opens that path or link. The picture lasts 5 minutes, then it is deleted on its own.",
      "CLI เปิดเส้นทางหรือลิงก์นั้น รูปอยู่ได้ 5 นาทีแล้วถูกลบเอง",
    ],
    featTitle: ["Shared by both paths", "สิ่งที่มีในทั้งสองทาง"],
    featSize: ["Size", "ขนาด"],
    featSizeH: ["Scaled automatically", "ย่อให้อัตโนมัติ"],
    featSizeP: [
      "Width stays at most 1000 pixels. A smaller picture is not enlarged.",
      "ความกว้างไม่เกิน 1000 พิกเซล รูปที่เล็กกว่านั้นไม่ถูกขยาย",
    ],
    featFile: ["File", "ไฟล์"],
    featFileH: ["Common picture types", "รับรูปที่ใช้กันทั่วไป"],
    featFileP: ["PNG, JPEG, GIF, and WebP. Other files are refused.", "PNG, JPEG, GIF และ WebP ไฟล์อื่นจะถูกปฏิเสธ"],
    featStatus: ["Status", "สถานะ"],
    featStatusH: ["You can see it working", "เห็นระหว่างทำ"],
    featStatusP: [
      "A bar shows while the picture is scaled, and while it is uploaded or written to disk.",
      "มีแถบระหว่างย่อรูป และระหว่างอัปโหลดหรือบันทึกลงดิสก์",
    ],
    featDup: ["Duplicate", "ซ้ำ"],
    featDupH: ["No instant duplicate", "ไม่สร้างของซ้ำทันที"],
    featDupP: [
      "The same picture as the last success is not sent or saved again until a different picture comes in between.",
      "รูปเดียวกับรูปที่เพิ่งสำเร็จจะไม่ถูกส่งหรือถูกบันทึกซ้ำ จนกว่าจะเป็นรูปอื่นคั่น",
    ],
    featTime: ["Time", "เวลา"],
    featTimeH: ["It lasts 5 minutes", "อยู่ได้ 5 นาที"],
    featTimeP: [
      "The link and the file are deleted when the time is up. Built for a temporary screenshot.",
      "ลิงก์และไฟล์ถูกลบเองเมื่อครบเวลา เหมาะกับภาพหน้าจอชั่วคราว",
    ],
    featAccount: ["Account", "เครื่อง"],
    featAccountH: ["No sign-up", "ไม่ต้องสมัคร"],
    featAccountP: [
      "No login and no ads. On the web, the link is the key to the picture.",
      "ไม่มีล็อกอินและไม่มีโฆษณา ลิงก์คือกุญแจของรูปบนเว็บ",
    ],
    supportLabel: ["Where ToSnip works", "ToSnip ใช้ได้ที่ไหน"],
    supportTitle: ["Where it works", "ใช้ได้ที่ไหน"],
    supportSub: [
      "The page in the browser works on Windows, Linux, and Mac. The tool that types a path into the terminal is for Windows.",
      "หน้าเว็บใช้ได้บน Windows, Linux และ Mac เครื่องมือที่พิมพ์เส้นทางลงเทอร์มินัลมีบน Windows",
    ],
    supportWinH: ["Browser and the terminal tool", "หน้าเว็บและเครื่องมือในเทอร์มินัล"],
    supportWinP: [
      "Paste on the web page. Or install the tool once, then press Ctrl+V in Windows Terminal, PowerShell, or CMD. The tool types a path in C:\\ToSnip.",
      "วางรูปบนหน้าเว็บ หรือติดตั้งเครื่องมือครั้งเดียว แล้วกด Ctrl+V ใน Windows Terminal, PowerShell หรือ CMD เครื่องมือจะพิมพ์เส้นทางใน C:\\ToSnip",
    ],
    supportLinuxH: ["Browser", "หน้าเว็บ"],
    supportLinuxP: [
      "Paste the picture on the web page and share the link. A CLI on Linux opens that link. The tool that types into the terminal is for Windows.",
      "วางรูปบนหน้าเว็บแล้วแชร์ลิงก์ CLI บน Linux เปิดลิงก์นั้นได้ เครื่องมือที่พิมพ์ลงเทอร์มินัลมีบน Windows",
    ],
    supportMacH: ["Browser", "หน้าเว็บ"],
    supportMacP: [
      "Paste the picture on the web page. On a Mac the paste key is Command+V. Share the link, and a CLI on the Mac opens it. The tool that types into the terminal is for Windows.",
      "วางรูปบนหน้าเว็บ บน Mac ปุ่มวางคือ Command+V แชร์ลิงก์แล้ว CLI บน Mac เปิดลิงก์นั้นได้ เครื่องมือที่พิมพ์ลงเทอร์มินัลมีบน Windows",
    ],
    supportTermH: ["Terminals that receive the typed path", "เทอร์มินัลที่ได้รับเส้นทางที่พิมพ์ให้"],
    supportTerm1: ["Windows Terminal", "Windows Terminal"],
    supportTerm2: ["PowerShell, including PowerShell 7", "PowerShell รวมถึง PowerShell 7"],
    supportTerm3: ["CMD", "CMD"],
    supportElseH: ["Other terminals", "เทอร์มินัลอื่น"],
    supportElseP: [
      "In Cursor, VS Code, a Linux terminal, or Terminal on a Mac, use the web page and give the CLI the link.",
      "ใน Cursor, VS Code, เทอร์มินัลบน Linux หรือ Terminal บน Mac ให้ใช้หน้าเว็บแล้วส่งลิงก์ให้ CLI",
    ],
    demoCapture: ["Print Screen", "แคปหน้าจอ"],
    demoPaste: ["Ctrl+V", "Ctrl+V"],
    demoScaling: ["Scaling", "กำลังย่อรูป"],
    demoSaving: ["Saving", "กำลังบันทึก"],
    demoSaved: ["Saved", "บันทึกแล้ว"],
    demoModePs: ["PowerShell", "PowerShell"],
    demoModeCmd: ["CMD", "CMD"],
    demoModeCli: ["CLI", "CLI"],
    demoTitleTerm: ["Windows Terminal", "Windows Terminal"],
    demoTitleCli: ["AI CLI", "AI CLI"],
    demoCaptionCapture: [
      "Drag across the screen. The picture lands on the clipboard.",
      "ลากคลุมหน้าจอ รูปอยู่บนคลิปบอร์ด",
    ],
    demoCaptionPaste: [
      "Ctrl+V. You do not type which file it is.",
      "กด Ctrl+V ไม่ต้องพิมพ์ว่าเป็นไฟล์ไหน",
    ],
    demoCaptionTool: [
      "Ctrl+V types this path. You do not name the file. An AI in this terminal can open it for 5 minutes.",
      "กด Ctrl+V แล้วเส้นทางนี้ถูกพิมพ์ให้ ไม่ต้องตั้งชื่อไฟล์ AI ในเทอร์มินัลนี้เปิดดูได้ 5 นาที",
    ],
    demoCaptionCmd: [
      "The same Ctrl+V works in CMD. The path is typed for you.",
      "Ctrl+V แบบเดียวกันใช้ได้ใน CMD เส้นทางถูกพิมพ์ให้",
    ],
    demoCaptionWeb: [
      "Nothing to install. Share this link. The picture deletes itself after 5 minutes.",
      "ไม่ต้องติดตั้ง แชร์ลิงก์นี้ได้ รูปถูกลบเองเมื่อครบ 5 นาที",
    ],
    quickLabel: ["Quick start", "เริ่มใช้ได้ทันที"],
    quickTitle: ["Quick start", "เริ่มใช้ได้ทันที"],
    quickWebK: ["On the web", "บนเว็บ"],
    quickWebH: ["Use it in the browser", "ใช้บนหน้าเว็บ"],
    quickWebP: [
      "Nothing to install. Open the page and paste the picture there.",
      "ไม่ต้องติดตั้ง เปิดหน้าแล้ววางรูปได้เลย",
    ],
    quickWebCta: ["Open the web page", "ไปหน้าใช้บนเว็บ"],
    quickCliK: ["On the CLI", "บน CLI"],
    quickCliH: ["Install on this PC", "ติดตั้งบนเครื่อง"],
    quickCliP: [
      "Copy this command, paste it into PowerShell, and press Enter.",
      "คัดลอกคำสั่งนี้ วางใน PowerShell แล้วกด Enter",
    ],
    quickInspect: ["Or read the script in Notepad before it runs", "หรือเปิดอ่านสคริปต์ใน Notepad ก่อนรัน"],
    demoLabel: ["Demo", "เดโม"],
    demoTitle: ["Watch the demo", "ดูเดโม"],
    demoSub: [
      "Three moves. Snip the screen, open a terminal, then Ctrl+V. The picture is ready for the AI.",
      "สามจังหวะ แคปหน้าจอ เปิดเทอร์มินัล แล้วกด Ctrl+V รูปพร้อมให้ AI เปิด",
    ],
    demoVideo: ["Demo: snip, then Ctrl+V in the terminal", "เดโม แคปแล้วกด Ctrl+V ในเทอร์มินัล"],
    demo1h: ["Take a snippet", "แคปส่วนที่ต้องการ"],
    demo1p: [
      "Drag over the part the AI should see. The picture stays on the clipboard.",
      "ลากคลุมส่วนที่อยากให้ AI ดู รูปอยู่บนคลิปบอร์ด",
    ],
    demo2h: ["Open the terminal", "เปิดเทอร์มินัล"],
    demo2p: [
      "Bring Windows Terminal, PowerShell, or CMD to the front.",
      "เปิด Windows Terminal, PowerShell หรือ CMD ให้อยู่ด้านหน้า",
    ],
    demo3h: ["Press Ctrl+V", "กด Ctrl+V"],
    demo3p: [
      "The path is typed at the cursor. The AI opens that file and sees the screen you snipped.",
      "เส้นทางถูกพิมพ์ที่เคอร์เซอร์ AI เปิดไฟล์นั้นและเห็นหน้าจอที่แคปไว้",
    ],
    seeLabel: ["How a CLI or terminal sees the screen", "CLI หรือเทอร์มินัลเห็นหน้าจออย่างไร"],
    seeTitle: ["Made so a CLI can see the screen", "ทำให้ CLI เห็นหน้าจอ"],
    seeSub: [
      "ToSnip works in a CLI and in a terminal. Copy the screen, paste once, and the AI looks at the picture you meant to show.",
      "ToSnip ใช้ได้บน CLI และเทอร์มินัล คัดลอกหน้าจอ วางครั้งเดียว แล้ว AI มองเห็นภาพที่ต้องการให้ดู",
    ],
    see1h: ["Copy the screen", "คัดลอกหน้าจอ"],
    see1p: [
      "Drag across the part you want shown. That picture sits on the clipboard. You do not save a file.",
      "ลากคลุมส่วนที่อยากให้ดู รูปอยู่บนคลิปบอร์ด ไม่ต้องบันทึกไฟล์",
    ],
    see2h: ["Paste in the terminal", "วางในเทอร์มินัล"],
    see2p: [
      "In Windows Terminal, PowerShell, or CMD, Ctrl+V types the path. On the web, the same paste copies a link any CLI can open.",
      "ใน Windows Terminal, PowerShell หรือ CMD กด Ctrl+V แล้วเส้นทางถูกพิมพ์ให้ บนเว็บ การวางครั้งเดียวกันคัดลอกลิงก์ที่ CLI ใดก็เปิดได้",
    ],
    see3h: ["The AI sees that picture", "AI เห็นภาพนั้น"],
    see3p: [
      "The CLI opens the path or the link and looks at the same screen you copied.",
      "CLI เปิดเส้นทางหรือลิงก์ แล้วมองเห็นหน้าจอชุดเดียวกับที่คัดลอกไว้",
    ],
    homeFoot: [
      "For a developer in PowerShell, CMD, or a CLI, and for anyone who needs an AI to see the screen. The picture lasts 5 minutes.",
      "สำหรับนักพัฒนาใน PowerShell, CMD หรือ CLI และสำหรับใครก็ตามที่ต้องการให้ AI เห็นหน้าจอ รูปอยู่ได้ 5 นาที",
    ],
    viewLabel: ["views", "ครั้ง"],

    metaWeb: [
      "Use ToSnip online with nothing to install. Share a short link. The picture deletes itself after 5 minutes.",
      "ใช้ ToSnip แบบออนไลน์โดยไม่ต้องติดตั้ง แชร์ลิงก์สั้นได้ รูปถูกลบเองเมื่อครบ 5 นาที",
    ],
    titleWeb: ["On the web · ToSnip", "วางบนเว็บ · ToSnip"],
    webEyebrow: ["In the browser", "ใช้งานบนหน้าเว็บ"],
    webChipInstall: ["No install", "ไม่ต้องติดตั้ง"],
    webChipShare: ["Share the link", "แชร์ลิงก์ได้"],
    webChipDelete: ["Deletes itself", "ลบรูปเอง"],
    webPageTitle: ["Nothing to install. Share the link. It deletes itself.", "ไม่ต้องติดตั้ง แชร์ลิงก์ได้ รูปถูกลบเอง"],
    webPageLead: [
      "Press <span class=\"keys\"><kbd>Print Screen</kbd></span> or <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span>, come back to this page, and press <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span>. Nothing is installed. The link is copied so you can share it with a person or an AI CLI. The picture deletes itself after 5 minutes.",
      "กด <span class=\"keys\"><kbd>Print Screen</kbd></span> หรือ <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> แล้วกลับมาที่หน้านี้ กด <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> ไม่ต้องติดตั้งอะไร ลิงก์ถูกคัดลอกไว้แชร์ให้คนหรือ AI CLI ได้ รูปถูกลบเองเมื่อครบ 5 นาที",
    ],
    dropLabel: ["Paste area", "พื้นที่วางรูป"],
    dropStrong: ["Press Ctrl+V to paste a picture", "กด Ctrl+V เพื่อวางรูป"],
    dropHint: ["Or drag a picture onto this page", "หรือลากรูปมาวางที่หน้านี้"],
    previewAlt: ["The picture you pasted", "รูปที่วางไว้"],
    linkAria: ["Picture link", "ลิงก์รูป"],
    webNote: [
      "Nothing to install. Share this link with anyone who should see the picture. It deletes itself after 5 minutes. In PowerShell, use curl.exe.",
      "ไม่ต้องติดตั้ง แชร์ลิงก์นี้ให้คนที่ควรเห็นรูป รูปถูกลบเองเมื่อครบ 5 นาที ใน PowerShell ให้ใช้ curl.exe",
    ],
    useH: ["How to use it", "วิธีใช้ทีละขั้น"],
    use1: ["Leave this page open. There is no sign-up and nothing to install.", "เปิดหน้านี้ค้างไว้ ไม่ต้องสมัครและไม่ต้องติดตั้ง"],
    use2: [
      "Press <span class=\"keys\"><kbd>Print Screen</kbd></span> for the whole screen, or press <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> and drag over one area. The picture goes to the clipboard. You do not save a file.",
      "กด <span class=\"keys\"><kbd>Print Screen</kbd></span> เพื่อทั้งหน้าจอ หรือกด <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> แล้วลากครอบส่วนที่ต้องการ รูปเข้าคลิปบอร์ด ไม่ต้องบันทึกไฟล์",
    ],
    use3: ["Click back on this page, then press <kbd>Ctrl</kbd> + <kbd>V</kbd>.", "คลิกกลับมาที่หน้านี้ แล้วกด <kbd>Ctrl</kbd> + <kbd>V</kbd>"],
    use4: [
      "Wait until scaling and uploading finish and the bar says Uploaded. The link is already on the clipboard.",
      "รอแถบย่อรูปและแถบอัปโหลดจนขึ้นว่าอัปโหลดแล้ว ลิงก์ถูกคัดลอกไว้ในคลิปบอร์ด",
    ],
    use5: ["Share the link with a person, or paste it into an AI CLI in PowerShell, CMD, or any other CLI. You do not tell it the file name.", "แชร์ลิงก์ให้คนอื่น หรือวางใน AI CLI ไม่ว่าจะเป็น PowerShell, CMD หรือ CLI อื่น ไม่ต้องบอกชื่อไฟล์"],
    useFile: [
      "If you already have a picture file, you can drag it onto this page. Pasting is the main path.",
      "ถ้ามีไฟล์รูปอยู่แล้ว สามารถลากไฟล์มาปล่อยบนหน้านี้ได้ การวางคือทางหลัก",
    ],
    afterH: ["What you see after a successful paste", "สิ่งที่ปรากฏหลังวางสำเร็จ"],
    after1: ["A preview, so you can check that the right picture was pasted", "ตัวอย่างรูป เพื่อตรวจว่าวางถูกภาพ"],
    after2: [
      "A link field. Click it and the whole field is selected, ready for Ctrl+C if the automatic copy did not run",
      "ช่องลิงก์ คลิกแล้วข้อความทั้งช่องถูกเลือก พร้อมกด Ctrl+C ถ้าการคัดลอกอัตโนมัติใช้ไม่ได้",
    ],
    after3: ["The size after scaling, such as 1000×600", "ขนาดหลังย่อ เช่น 1000×600"],
    after4: [
      "The command <code>curl.exe -L \"link\" -o shot.png</code> for saving the image file",
      "คำสั่ง <code>curl.exe -L \"ลิงก์\" -o shot.png</code> สำหรับดึงไฟล์รูป",
    ],
    after5: ["A countdown until the 5 minutes are up", "เวลานับถอยหลังจนครบ 5 นาที"],
    afterReady: [
      "A green status that says \"Ready. The link was copied.\" means the link is on the clipboard and can be pasted somewhere else.",
      "สถานะสีเขียวคำว่า «พร้อมใช้งาน คัดลอกลิงก์แล้ว» หมายความว่าลิงก์อยู่ในคลิปบอร์ด พร้อมวางที่อื่นได้เลย",
    ],
    cliH: ["Open the picture from a CLI", "เปิดรูปจาก CLI"],
    cli1: [
      "The link looks like <code>https://tosnip.com/v/</code> followed by 6 letters or digits. Opening it returns the image file itself, not another web page around it.",
      "ลิงก์อยู่ในรูป <code>https://tosnip.com/v/</code> ตามด้วยตัวอักษรหรือตัวเลข 6 ตัว เปิดลิงก์แล้วได้ไฟล์รูปโดยตรง ไม่ใช่หน้าเว็บหุ้มอีกชั้น",
    ],
    cli2: ["In PowerShell, <code>curl</code> is a different command. Use <code>curl.exe</code>.", "ใน PowerShell คำสั่ง <code>curl</code> เป็นชื่ออื่น ให้ใช้ <code>curl.exe</code>"],
    cli3: [
      "Replace xyz123 with the real link from this page. Anyone with the link can open the picture until it expires. There is no login.",
      "ใส่ลิงก์จริงที่ได้จากหน้านี้แทนตัวอย่าง xyz123 ใครมีลิงก์จะเปิดรูปได้จนกว่าจะหมดเวลา ไม่มีล็อกอิน",
    ],
    barH: ["The progress bar", "แถบความคืบหน้า"],
    barP: [
      "While the picture is scaled, the bar moves back and forth and says \"Scaling\". While it is sent, the bar follows the real percentage of data leaving this machine and says \"Uploading\". When it finishes, the bar stays at 100% and says \"Uploaded\".",
      "ระหว่างย่อรูป แถบจะเลื่อนไปมาและขึ้นว่า «กำลังย่อรูป» ระหว่างส่ง แถบจะเดินตามเปอร์เซ็นต์จริงของข้อมูลที่ออกจากเครื่อง และขึ้นว่า «กำลังอัปโหลด» เมื่อเสร็จ แถบค้างที่ 100% พร้อมคำว่า «อัปโหลดแล้ว»",
    ],
    barFail: [
      "If the paste fails, the bar is hidden and a red message explains why.",
      "ถ้าวางไม่สำเร็จ แถบจะถูกซ่อน และมีข้อความสีแดงบอกสาเหตุ",
    ],
    dupH: ["The same picture again", "รูปซ้ำ"],
    dup1: [
      "If you paste the same source file as the last picture that uploaded successfully, it is not sent again, and the page says \"This is the same image as the one just pasted. It cannot be pasted again.\" The bar from the finished job is hidden.",
      "ถ้าวางรูปที่เป็นไฟล์ต้นทางชุดเดียวกับรูปที่อัปโหลดสำเร็จครั้งล่าสุด ระบบจะไม่ส่งซ้ำ และขึ้นว่า «รูปนี้ซ้ำกับรูปที่เพิ่งวาง วางซ้ำไม่ได้» แถบของงานที่จบแล้วจะถูกซ่อน",
    ],
    dup2: [
      "Paste a different picture in between, then paste the first one again, and it is accepted. A picture that failed to send is not remembered as the last one.",
      "ถ้าวางรูปอื่นคั่นกลาง แล้วกลับมาวางรูปแรกอีกครั้ง ระบบรับรูปนั้นได้ใหม่ รูปที่ส่งไม่สำเร็จจะไม่ถูกจำว่าเป็นรูปหลังสุด",
    ],
    ttlH: ["It deletes itself", "รูปถูกลบเอง"],
    ttlP: [
      "Five minutes after a successful upload, the picture deletes itself. Opening the link after that does not find it. Nothing stays behind as a permanent store.",
      "ครบ 5 นาทีหลังอัปโหลดสำเร็จ รูปจะถูกลบเอง เปิดลิงก์หลังนั้นจะไม่พบรูป ไม่มีอะไรค้างเป็นที่เก็บถาวร",
    ],
    typeH: ["Picture types and size", "ชนิดรูปและขนาด"],
    type1: ["PNG, JPEG, GIF, and WebP are accepted", "รับ PNG, JPEG, GIF และ WebP"],
    type2: ["SVG and files that are not pictures are refused", "SVG และไฟล์ที่ไม่ใช่รูปจะถูกปฏิเสธ"],
    type3: [
      "Width is reduced to at most 1000 pixels, keeping the proportions. A narrower picture stays at its own size.",
      "ความกว้างถูกย่อให้ไม่เกิน 1000 พิกเซล โดยคงสัดส่วน รูปที่แคบกว่านั้นคงขนาดเดิม",
    ],
    type4: [
      "If it is still too large after scaling, quality or size is reduced further. If it is still too large, the page says so.",
      "หลังย่อแล้วยังใหญ่เกินกว่าที่รับได้ ระบบจะลดคุณภาพหรือลดขนาดลงอีก ถ้ายังเกินจะบอกว่าใหญ่เกินไป",
    ],
    failH: ["When a paste fails", "เมื่อวางไม่สำเร็จ"],
    fail1: [
      "\"Only PNG, JPEG, GIF, or WebP pictures can be pasted.\" when the clipboard or the file is not a supported picture",
      "«วางได้เฉพาะรูป PNG, JPEG, GIF หรือ WebP» เมื่อคลิปบอร์ดหรือไฟล์ไม่ใช่รูปที่รองรับ",
    ],
    fail2: [
      "\"The picture is still too large after scaling.\" when it is still over the limit after compression",
      "«รูปยังใหญ่เกินไปหลังย่อแล้ว» เมื่อบีบอัดแล้วยังเกินขนาดที่รับ",
    ],
    fail3: [
      "\"The server could not be reached.\" when the network fails. You can paste again.",
      "«ติดต่อเซิร์ฟเวอร์ไม่ได้» เมื่อเครือข่ายขัดข้อง วางใหม่ได้",
    ],
    fail4: [
      "\"The server ran into a problem.\" when the service does not answer successfully",
      "«เซิร์ฟเวอร์ขัดข้อง» เมื่อบริการตอบไม่สำเร็จ",
    ],
    otherH: ["The other path", "อีกทางหนึ่ง"],
    otherP: [
      "To press Ctrl+V in CMD and get a file path on this PC, without sending the picture to the web, use the tool on this PC.",
      "ถ้าต้องการกด Ctrl+V ใน CMD แล้วได้เส้นทางไฟล์บนเครื่อง โดยไม่ส่งรูปขึ้นเว็บ ให้ใช้เครื่องมือในเครื่อง",
    ],
    otherCta: ["See the tool on this PC", "ดูเครื่องมือในเครื่อง"],
    webFoot: [
      "Share the link while you need it. The picture deletes itself after 5 minutes.",
      "แชร์ลิงก์ได้ระหว่างที่ต้องใช้ รูปถูกลบเองเมื่อครบ 5 นาที",
    ],
    uploading: ["Uploading", "กำลังอัปโหลด"],
    errNotImage: ["Only PNG, JPEG, GIF, or WebP pictures can be pasted.", "วางได้เฉพาะรูป PNG, JPEG, GIF หรือ WebP"],
    errTooLarge: ["The picture is still too large after scaling.", "รูปยังใหญ่เกินไปหลังย่อแล้ว"],
    errBadRequest: ["The picture could not be sent.", "ส่งรูปไม่สำเร็จ"],
    errServer: ["The server ran into a problem.", "เซิร์ฟเวอร์ขัดข้อง"],
    errNetwork: ["The server could not be reached.", "ติดต่อเซิร์ฟเวอร์ไม่ได้"],
    errDuplicate: [
      "This is the same image as the one just pasted. It cannot be pasted again.",
      "รูปนี้ซ้ำกับรูปที่เพิ่งวาง วางซ้ำไม่ได้",
    ],
    shrinking: ["Scaling", "กำลังย่อรูป"],
    shrinkingStatus: ["Scaling...", "กำลังย่อรูป..."],
    uploadingStatus: ["Uploading...", "กำลังอัปโหลด..."],
    uploaded: ["Uploaded", "อัปโหลดแล้ว"],
    shrunk: ["Scaled to {w}×{h}", "ย่อแล้ว {w}×{h}"],
    remaining: ["{time} left", "เหลือเวลา {time}"],
    expired: ["Expired", "หมดอายุแล้ว"],
    readyCopied: ["Ready. The link was copied.", "พร้อมใช้งาน คัดลอกลิงก์แล้ว"],
    readyManual: ["Ready. The link is selected. Press Ctrl+C.", "พร้อมใช้งาน ลิงก์ถูกเลือกไว้แล้ว กด Ctrl+C"],

    metaTool: [
      "Install once, then Print Screen and Ctrl+V in PowerShell, CMD, or Windows Terminal. The path is typed for the AI. You do not name the file.",
      "ติดตั้งครั้งเดียว แล้ว Print Screen กับ Ctrl+V ใน PowerShell, CMD หรือ Windows Terminal เส้นทางถูกพิมพ์ให้ AI ไม่ต้องตั้งชื่อไฟล์",
    ],
    titleTool: ["On this PC · ToSnip", "เครื่องมือในเครื่อง · ToSnip"],
    toolEyebrow: ["Install on this PC", "ลงเครื่องมือในเครื่อง"],
    toolPageTitle: ["Ctrl+V, and the AI sees the file", "Ctrl+V แล้ว AI เห็นไฟล์"],
    toolPageLead: [
      "After a one-time install, press <span class=\"keys\"><kbd>Print Screen</kbd></span> or <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span>, then <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> in PowerShell, CMD, or Windows Terminal. You do not save the picture yourself, and you do not type its name. The helper writes a JPEG in the <code>C:\\ToSnip</code> folder and types the path so an AI in that CLI can open it. Nothing is uploaded to the web.",
      "หลังติดตั้งครั้งเดียว กด <span class=\"keys\"><kbd>Print Screen</kbd></span> หรือ <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> แล้วกด <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> ใน PowerShell, CMD หรือ Windows Terminal ไม่ต้องบันทึกรูปเอง และไม่ต้องพิมพ์ชื่อไฟล์ ตัวช่วยเขียนไฟล์ JPEG ในโฟลเดอร์ <code>C:\\ToSnip</code> แล้วพิมพ์เส้นทางให้ AI ใน CLI นั้นเปิดได้ ไม่มีการอัปโหลดขึ้นเว็บ",
    ],
    installH: ["Install once", "ติดตั้งครั้งเดียว"],
    install1: [
      "Open a normal PowerShell window. It does not need to run as administrator. If the terminal you use every day runs as administrator, read that section below first.",
      "เปิด PowerShell หน้าต่างธรรมดา ไม่ต้องเปิดแบบผู้ดูแลระบบ ถ้าเทอร์มินัลที่ใช้งานประจำเป็นแบบผู้ดูแล ให้อ่านหัวข้อนั้นด้านล่างก่อน",
    ],
    install2: ["Press the copy button, paste the command into PowerShell, and press Enter.", "กดปุ่มคัดลอก แล้ววางคำสั่งใน PowerShell จากนั้นกด Enter"],
    install3: [
      "When it succeeds, PowerShell prints that the helper is installed. The helper starts at once and opens itself every time you sign in to Windows.",
      "เมื่อสำเร็จ จะมีข้อความว่าติดตั้งแล้ว ตัวช่วยเริ่มทำงานทันที และจะเปิดเองทุกครั้งที่เข้า Windows",
    ],
    installNote: [
      "This command downloads the helper into the <code>LocalAppData\\ToSnip</code> folder, creates a Startup shortcut named ToSnip paste, and creates the picture folder at the root of the drive.",
      "คำสั่งนี้ดาวน์โหลดตัวช่วยมาไว้ที่โฟลเดอร์ <code>LocalAppData\\ToSnip</code> สร้างทางลัดชื่อ ToSnip paste ในโฟลเดอร์ Startup และสร้างโฟลเดอร์เก็บรูปที่รากไดรฟ์",
    ],
    installAria: ["Install command", "คำสั่งติดตั้ง"],
    installCopied: ["Install command copied. Paste it into PowerShell.", "คัดลอกคำสั่งติดตั้งแล้ว นำไปวางใน PowerShell"],
    inspectH: ["Inspect before you execute:", "เสนอทางเลือก Inspect ก่อน Execute:"],
    inspectNote: ["# Read the script before you run it", "# แนะนำให้ผู้ใช้อ่านโค้ดก่อน"],
    inspectAfter: [
      "This writes <code>install.ps1</code> in the current folder and opens it in Notepad. When you have read it, run <code>.\\install.ps1</code> in that same window.",
      "คำสั่งนี้เขียน <code>install.ps1</code> ไว้ในโฟลเดอร์ปัจจุบันแล้วเปิดใน Notepad เมื่ออ่านแล้ว ให้รัน <code>.\\install.ps1</code> ในหน้าต่างเดิม",
    ],
    inspectCopied: ["Command copied. Paste it into PowerShell.", "คัดลอกคำสั่งแล้ว นำไปวางใน PowerShell"],
    pkgDownload: ["Download commands", "ดาวน์โหลดคำสั่ง"],
    pkgCopy: ["Copy commands", "คัดลอกคำสั่ง"],
    dailyH: ["Each time after install", "ใช้ทุกครั้งหลังติดตั้ง"],
    daily1: ["Press <span class=\"keys\"><kbd>Print Screen</kbd></span>, or press <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> and drag over the area you need.", "กด <span class=\"keys\"><kbd>Print Screen</kbd></span> หรือกด <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> แล้วลากครอบส่วนที่ต้องการ"],
    daily2: [
      "Click the command line in CMD, PowerShell, or Windows Terminal so that window is in front.",
      "คลิกที่บรรทัดคำสั่งของ CMD, PowerShell หรือ Windows Terminal ให้หน้าต่างนั้นอยู่ด้านหน้า",
    ],
    daily3: ["Press <kbd>Ctrl</kbd> + <kbd>V</kbd>.", "กด <kbd>Ctrl</kbd> + <kbd>V</kbd>"],
    daily4: [
      "A bar appears near that window while the picture is scaled and saved. The path is then typed at the cursor, and the bar goes away.",
      "แถบจะโผล่ใกล้หน้าต่างนั้น ระหว่างย่อรูปและบันทึกไฟล์ จากนั้นเส้นทางถูกพิมพ์ลงตำแหน่งเคอร์เซอร์ และแถบจะหายไป",
    ],
    dailyP: [
      "The helper runs when the clipboard holds a picture and the front window is a terminal. If you paste ordinary text, Ctrl+V still pastes that text.",
      "ตัวช่วยทำงานเมื่อคลิปบอร์ดมีรูป และหน้าต่างด้านหน้าเป็นเทอร์มินัล ถ้าวางข้อความธรรมดา Ctrl+V ยังวางข้อความตามปกติ",
    ],
    dailyFocus: [
      "If focus leaves the terminal while the file is being saved, the path is copied instead, and the bar tells you to press Ctrl+V again.",
      "ถ้าโฟกัสหลุดจากเทอร์มินัลระหว่างบันทึก เส้นทางจะถูกคัดลอกไว้แทน แล้วแถบจะบอกให้กด Ctrl+V อีกครั้ง",
    ],
    toastH: ["The bar near the window", "แถบที่ขึ้นใกล้หน้าต่าง"],
    toast1: ["Scaling, while the width is brought down to 1000 pixels at most", "«กำลังย่อรูป» ขณะลดความกว้างให้ไม่เกิน 1000 พิกเซล"],
    toast2: ["Saving, while the file is written to disk", "«กำลังบันทึก» ขณะเขียนไฟล์ลงดิสก์"],
    toast3: [
      "Saved, with the path, when writing finishes. The bar stays briefly, then closes.",
      "«บันทึกแล้ว» พร้อมเส้นทาง เมื่อเขียนเสร็จ แถบค้างสั้นๆ แล้วปิดเอง",
    ],
    toast4: ["Same file, when the picture matches one that has not expired yet", "«ใช้ไฟล์เดิม» เมื่อรูปซ้ำกับรูปที่ยังไม่หมดอายุ"],
    toastFail: [
      "If the save fails, the bar turns red and closes itself after the message.",
      "ถ้าบันทึกไม่ได้ แถบจะเป็นสีแดงและปิดเองหลังแสดงข้อความ",
    ],
    whereH: ["Where the file is", "ไฟล์อยู่ที่ไหน"],
    where1: [
      "The picture is saved as a JPEG with a 6-character name, in a folder named after this system at the root of the drive, for example <code>C:\\ToSnip\\a1b2c3.jpg</code>. That path is typed into the command line so a program on this PC can open the file at once.",
      "รูปถูกบันทึกเป็น JPEG ชื่อ 6 ตัว ในโฟลเดอร์ชื่อระบบที่รากไดรฟ์ เช่น <code>C:\\ToSnip\\a1b2c3.jpg</code> เส้นทางนี้ถูกพิมพ์ลงบรรทัดคำสั่ง เพื่อให้โปรแกรมบนเครื่องเปิดไฟล์ได้ทันที",
    ],
    where2: [
      "If this PC does not allow a folder at the drive root, the helper stores pictures in <code>LocalAppData\\ToSnip\\images</code> instead. A path that contains a space is wrapped in quotes so it is ready to use in a command.",
      "ถ้าเครื่องไม่อนุญาตให้สร้างโฟลเดอร์ที่รากไดรฟ์ ตัวช่วยจะเก็บรูปไว้ที่ <code>LocalAppData\\ToSnip\\images</code> แทน เส้นทางที่มีช่องว่างจะถูกใส่เครื่องหมายคำพูดให้พร้อมใช้ในคำสั่ง",
    ],
    where3: [
      "The folder contains <code>tosnip.txt</code>, a marker that this folder belongs to ToSnip. Uninstall uses it so a folder of the same name that was not created here is left alone.",
      "ในโฟลเดอร์จะมีไฟล์ <code>tosnip.txt</code> เป็นเครื่องหมายว่าโฟลเดอร์นี้เป็นของระบบ ใช้ตอนถอนการติดตั้ง เพื่อไม่ไปลบโฟลเดอร์ชื่อเดียวกันที่ไม่ได้สร้างจากที่นี่",
    ],
    lifeH: ["The same picture, and the 5 minutes", "รูปซ้ำและอายุ 5 นาที"],
    life1: [
      "If you paste the same picture while the previous file is still there and the 5 minutes are not up, the helper does not create a new file. It types the same path.",
      "ถ้าวางรูปเดิมขณะไฟล์ก่อนหน้ายังอยู่และยังไม่ครบ 5 นาที ตัวช่วยจะไม่สร้างไฟล์ใหม่ และพิมพ์เส้นทางเดิมให้",
    ],
    life2: [
      "When the 5 minutes are up, the file is deleted. The old path no longer opens. A screenshot does not stay on this PC after you are done with it.",
      "เมื่อครบ 5 นาที ไฟล์จะถูกลบ เส้นทางเก่าเปิดไม่ได้อีก ภาพหน้าจอจึงไม่ค้างอยู่ในเครื่องหลังเลิกใช้",
    ],
    trayH: ["It starts on its own, and you can pause it", "เปิดเองและปิดชั่วคราว"],
    tray1: [
      "After install, the helper sits in the Windows system tray at the lower right, and it starts every time you sign in. The icon is the program icon, and the menu item is Exit.",
      "หลังติดตั้ง ตัวช่วยอยู่ในถาดระบบ มุมล่างขวาของ Windows และเปิดเองทุกครั้งที่เข้าสู่ระบบ ไอคอนใช้ไอคอนของโปรแกรม พร้อมเมนูคำว่า «ออก»",
    ],
    tray2: [
      "Choose Exit to close it for this session. The next time you sign in to Windows, it comes back. If you started the helper from a visible window, Ctrl+C in that window closes it too.",
      "ปิดเฉพาะรอบนี้ได้จากเมนูถาดคำว่า ออก รอบหน้าที่จะเข้า Windows ตัวช่วยจะกลับมาเอง ถ้าเปิดตัวช่วยจากหน้าต่างที่มองเห็น การกด Ctrl+C ในหน้าต่างนั้นก็ปิดได้เช่นกัน",
    ],
    tray3: [
      "If the helper is already running and you start it again, a message says the helper is already running.",
      "ถ้ามีตัวช่วยทำงานอยู่แล้ว แล้วสั่งเปิดซ้ำ จะมีข้อความว่าตัวช่วยทำงานอยู่แล้ว",
    ],
    adminH: ["When the terminal is an administrator", "เมื่อเทอร์มินัลเป็นผู้ดูแลระบบ"],
    adminP: [
      "A window opened with Run as administrator cannot see typing from an ordinary program. If CMD or Windows Terminal was opened as administrator, start the helper as administrator too. Otherwise Ctrl+V may not type the path into the command line.",
      "หน้าต่างที่เปิดแบบ Run as administrator มองไม่เห็นการพิมพ์จากโปรแกรมธรรมดา ถ้า CMD หรือ Windows Terminal ถูกเปิดแบบผู้ดูแล ให้เปิดตัวช่วยแบบผู้ดูแลด้วย ไม่งั้นกด Ctrl+V แล้วรูปอาจไม่ถูกพิมพ์ลงบรรทัดคำสั่ง",
    ],
    uninstallH: ["Uninstall", "ถอนการติดตั้ง"],
    uninstall1: [
      "Open PowerShell and paste the command below. It stops the helper, removes the sign-in startup, deletes the files in <code>LocalAppData\\ToSnip</code>, and deletes ToSnip pictures in <code>C:\\ToSnip</code>. When it finishes, PowerShell prints that the helper will not start by itself again.",
      "เปิด PowerShell แล้ววางคำสั่งด้านล่าง คำสั่งจะหยุดตัวช่วย ลบการเปิดอัตโนมัติตอนเข้า Windows ลบไฟล์ในโฟลเดอร์ <code>LocalAppData\\ToSnip</code> และลบรูปของระบบในโฟลเดอร์ <code>C:\\ToSnip</code>",
    ],
    uninstall2: [
      "Only the 6-character files this system created are deleted. If the folder holds anything else, those files stay, and the folder itself is removed only when it is empty.",
      "รูปที่ถูกลบคือไฟล์ชื่อ 6 ตัวที่ระบบสร้างเท่านั้น ถ้าในโฟลเดอร์มีไฟล์อื่น คำสั่งจะเหลือไฟล์นั้นไว้ และจะลบทั้งโฟลเดอร์ก็ต่อเมื่อข้างในว่างแล้ว",
    ],
    uninstallAria: ["Uninstall command", "คำสั่งถอนการติดตั้ง"],
    uninstallCopied: ["Uninstall command copied. Paste it into PowerShell.", "คัดลอกคำสั่งถอนการติดตั้งแล้ว นำไปวางใน PowerShell"],
    toolOtherH: ["The other path", "อีกทางหนึ่ง"],
    toolOtherP: [
      "If you want a link that another machine can open, without installing anything on this PC, paste the picture on the web.",
      "ถ้าต้องการลิงก์ที่เครื่องอื่นเปิดได้ โดยไม่ติดตั้งอะไรบนเครื่องนี้ ให้วางรูปบนหน้าเว็บ",
    ],
    toolOtherCta: ["Paste on the web", "ไปวางรูปบนเว็บ"],
    toolFoot: [
      "The picture stays on this PC's disk for 5 minutes, then it is deleted.",
      "รูปอยู่บนดิสก์ของเครื่องนี้ 5 นาที แล้วถูกลบเอง",
    ],
    metaWhy: [
      "Why a screenshot on the clipboard never reaches a CLI, and how ToSnip turns it into a path or a short link.",
      "ทำไมรูปบนคลิปบอร์ดไปไม่ถึง CLI และ ToSnip เปลี่ยนรูปนั้นเป็นเส้นทางหรือลิงก์สั้นได้อย่างไร",
    ],
    titleWhy: ["The problem · ToSnip", "ปัญหา · ToSnip"],
    whyEyebrow: ["Why ToSnip", "ทำไมต้องใช้ ToSnip"],
    whyPageTitle: ["The screenshot is on the clipboard. The CLI still cannot see it.", "รูปอยู่บนคลิปบอร์ด แต่ CLI ยังมองไม่เห็น"],
    whyPageLead: [
      "ToSnip is for that gap. Print Screen, then Ctrl+V, and an AI in a terminal can open the screen you captured. You do not save the file, and you do not type its name.",
      "ToSnip ทำมาปิดช่องนี้ กด Print Screen แล้ว Ctrl+V แล้ว AI ในเทอร์มินัลเปิดหน้าจอที่แคปไว้ได้ ไม่ต้องบันทึกไฟล์ และไม่ต้องพิมพ์ชื่อรูป",
    ],
    whyJump1: ["The clipboard", "คลิปบอร์ด"],
    whyJump2: ["Chat labels", "ป้ายในแชต"],
    whyJump3: ["No install", "ไม่ต้องติดตั้ง"],
    whyJump4: ["Five minutes", "ห้านาที"],
    whyJump5: ["Administrator", "ผู้ดูแลระบบ"],
    whyFixH: ["How ToSnip fixes it", "ToSnip แก้แบบนี้"],
    why1h: ["A terminal cannot open the clipboard", "เทอร์มินัลเปิดรูปจากคลิปบอร์ดไม่ได้"],
    why1p: [
      "Press <span class=\"keys\"><kbd>Print Screen</kbd></span> for the whole screen, or <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> and drag over one area. The picture stays on the clipboard. PowerShell, CMD, Windows Terminal, and an AI CLI accept text at the cursor. <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> in those windows does not place the picture. Saving the file yourself means you choose a folder, invent a name, and type that path.",
      "กด <span class=\"keys\"><kbd>Print Screen</kbd></span> เพื่อทั้งหน้าจอ หรือ <span class=\"keys\"><kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> แล้วลากคลุมส่วนที่ต้องการ รูปอยู่บนคลิปบอร์ด PowerShell, CMD, Windows Terminal และ AI CLI รับได้แค่ข้อความที่เคอร์เซอร์ <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> ในหน้าต่างเหล่านั้นไม่วางรูปให้ การบันทึกเองต้องเลือกโฟลเดอร์ ตั้งชื่อ แล้วพิมพ์เส้นทางนั้น",
    ],
    why1f: [
      "Install once on this PC. After that, <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> in Windows Terminal, PowerShell, PowerShell 7, or CMD writes a JPEG in <code>C:\\ToSnip</code> and types the path at the cursor. The name is six characters, and you do not choose it. The width stays at most 1000 pixels. A smaller picture is not enlarged. The helper does not press Enter, so you still send the command yourself. Nothing from this path is uploaded.",
      "ติดตั้งครั้งเดียวบนเครื่องนี้ จากนั้นกด <span class=\"keys\"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> ใน Windows Terminal, PowerShell, PowerShell 7 หรือ CMD ระบบจะเขียน JPEG ไว้ใน <code>C:\\ToSnip</code> แล้วพิมพ์เส้นทางที่เคอร์เซอร์ ชื่อไฟล์มี 6 ตัว และคุณไม่ต้องตั้งเอง ความกว้างอยู่ที่ไม่เกิน 1000 พิกเซล รูปที่เล็กกว่าจะไม่ถูกขยาย ตัวช่วยไม่กด Enter คุณยังเป็นคนส่งคำสั่งเอง ไม่มีการอัปโหลดจากเส้นทางนี้",
    ],
    why1n: [
      "The same picture, while the file is still there and the 5 minutes are not up, types the same path again. If the window in front changes while the file is saved, the path is copied and the bar tells you to press Ctrl+V. A path that contains a space is quoted. If a folder cannot be created at the drive root, the file is stored in <code>LocalAppData\\ToSnip\\images</code>. Pasting ordinary text still pastes that text.",
      "ถ้าวางรูปเดิมขณะที่ไฟล์ยังอยู่และยังไม่ครบ 5 นาที ระบบจะพิมพ์เส้นทางเดิมให้ ถ้าหน้าต่างด้านหน้าเปลี่ยนระหว่างบันทึก เส้นทางจะถูกคัดลอก และแถบจะบอกให้กด Ctrl+V อีกครั้ง เส้นทางที่มีช่องว่างจะถูกใส่เครื่องหมายคำพูด ถ้าสร้างโฟลเดอร์ที่รากไดรฟ์ไม่ได้ ไฟล์จะอยู่ที่ <code>LocalAppData\\ToSnip\\images</code> การวางข้อความธรรมดายังวางข้อความนั้นอยู่",
    ],
    why2h: ["[Image #1] is not a file", "[Image #1] ไม่ใช่ไฟล์"],
    why2p: [
      "A chat inserts [Image #1] when a picture is attached. The number is only the order of pictures in that message, and the next message starts again at 1. ToSnip does not create the label. The label does not record that the picture was a screenshot, and a CLI cannot open it.",
      "แชตใส่ [Image #1] เมื่อมีรูปแนบมา ตัวเลขเป็นแค่ลำดับของรูปในข้อความนั้น และข้อความถัดไปเริ่มที่ 1 ใหม่ ToSnip ไม่ได้สร้างป้ายนี้ ป้ายไม่ได้บอกว่ารูปมาจากการแคปหน้าจอ และ CLI เปิดป้ายนี้ไม่ได้",
    ],
    why2f: [
      "ToSnip gives a path such as <code>C:\\ToSnip\\a1b2c3.jpg</code>, or a link such as <code>https://tosnip.com/v/a1b2c3</code>. The CLI opens that address and receives the picture.",
      "ToSnip ให้เส้นทางเช่น <code>C:\\ToSnip\\a1b2c3.jpg</code> หรือลิงก์เช่น <code>https://tosnip.com/v/a1b2c3</code> CLI เปิดที่อยู่นั้นแล้วได้รูป",
    ],
    why3h: ["Some windows should get a link, not a program", "บางหน้าต่างควรได้ลิงก์ ไม่ใช่โปรแกรม"],
    why3p: [
      "The AI may be in Cursor, VS Code, a Linux terminal, or Terminal on a Mac. Those windows do not receive a typed path from the Windows helper. Another person, or another machine, also needs a link rather than a folder on this disk.",
      "AI อาจอยู่ใน Cursor, VS Code, เทอร์มินัลบน Linux หรือ Terminal บน Mac หน้าต่างเหล่านั้นไม่ได้รับเส้นทางที่ถูกพิมพ์จากตัวช่วยของ Windows คนอื่นหรือเครื่องอื่นก็ต้องการลิงก์ ไม่ใช่โฟลเดอร์บนดิสก์นี้",
    ],
    why3f: [
      "Open the web page and paste. Nothing is installed. The short link is copied. On a Mac the paste key is <span class=\"keys\"><kbd>Command</kbd> + <kbd>V</kbd></span>. Anyone who has the link can view the picture for 5 minutes. There is no account and no ads. The link is the key to the picture.",
      "เปิดหน้าเว็บแล้ววางรูป ไม่ต้องติดตั้ง ลิงก์สั้นถูกคัดลอกไว้ บน Mac ปุ่มวางคือ <span class=\"keys\"><kbd>Command</kbd> + <kbd>V</kbd></span> ใครมีลิงก์จะเห็นรูปได้ 5 นาที ไม่มีบัญชีและไม่มีโฆษณา ลิงก์คือกุญแจของรูป",
    ],
    why4h: ["A screenshot should not stay", "รูปแคปไม่ควรค้างอยู่"],
    why4p: [
      "The screen you captured is often useful for a minute and then finished. A file left in a folder, or a link that still opens next week, keeps that screen around.",
      "หน้าจอที่แคปไว้มักใช้ได้แค่ครู่หนึ่ง ไฟล์ที่ค้างในโฟลเดอร์ หรือลิงก์ที่สัปดาห์หน้ายังเปิดได้ จะเก็บหน้าจอนั้นไว้ต่อ",
    ],
    why4f: [
      "The JPEG on this PC and the picture on the web last 5 minutes, then they are deleted. The old path and the old link no longer open. Pasting that exact picture again, with no different picture in between, is refused. Paste A, then a different picture, then A again, and the second A is kept.",
      "JPEG บนเครื่องนี้และรูปบนเว็บอยู่ได้ 5 นาที แล้วถูกลบ เส้นทางเดิมและลิงก์เดิมเปิดไม่ได้อีก ถ้าวางรูปเดิมซ้ำโดยไม่มีรูปอื่นคั่น จะวางไม่ได้ ถ้าวาง A แล้ววางรูปอื่น แล้ววาง A อีกครั้ง ครั้งหลังจะถูกเก็บ",
    ],
    why5h: ["An administrator window ignores a normal helper", "หน้าต่างผู้ดูแลไม่รับตัวช่วยธรรมดา"],
    why5p: [
      "A terminal opened with Run as administrator does not accept keystrokes from a program started the normal way. Ctrl+V can then fail to type the path.",
      "เทอร์มินัลที่เปิดแบบ Run as administrator ไม่รับการพิมพ์จากโปรแกรมที่เปิดแบบธรรมดา กด Ctrl+V แล้วเส้นทางอาจไม่ถูกพิมพ์",
    ],
    why5f: [
      "Start the helper as administrator when that terminal is an administrator. Otherwise paste on the web page and give the CLI the link.",
      "ถ้าเทอร์มินัลนั้นเป็นผู้ดูแล ให้เปิดตัวช่วยแบบผู้ดูแลด้วย ไม่งั้นวางรูปบนหน้าเว็บแล้วส่งลิงก์ให้ CLI",
    ],
    whyNextH: ["Pick the path that matches the window", "เลือกทางที่ตรงกับหน้าต่างนั้น"],
    whyNextP: [
      "Use the web page when you want a link and nothing installed. Install on this PC when you want Ctrl+V to type a path in Windows Terminal, PowerShell, or CMD.",
      "ใช้หน้าเว็บเมื่อต้องการลิงก์และไม่ต้องติดตั้ง ติดตั้งบนเครื่องนี้เมื่อต้องการให้ Ctrl+V พิมพ์เส้นทางใน Windows Terminal, PowerShell หรือ CMD",
    ],
    whyWebCta: ["Use it on the web", "ใช้บนหน้าเว็บ"],
    whyToolCta: ["Install on this PC", "ติดตั้งบนเครื่องนี้"],
    whyFoot: [
      "The picture lasts 5 minutes on the web and on this PC, then it is deleted.",
      "รูปอยู่ได้ 5 นาทีทั้งบนเว็บและบนเครื่องนี้ แล้วถูกลบ",
    ],
    copy: ["Copy", "คัดลอก"],
    copied: ["Copied", "คัดลอกแล้ว"],
    copyManual: ["The command is selected. Press Ctrl+C.", "คำสั่งถูกเลือกไว้แล้ว กด Ctrl+C"],
  };

  const dict = { en: {}, th: {} };
  for (const key of Object.keys(phrases)) {
    dict.en[key] = phrases[key][0];
    dict.th[key] = phrases[key][1];
  }

  function stored() {
    try {
      return localStorage.getItem("spaceur-lang") === "th" ? "th" : "en";
    } catch (e) {
      return "en";
    }
  }

  let lang = stored();

  function t(key, vars) {
    const table = dict[lang] || dict.en;
    let text = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : dict.en[key];
    if (text == null) text = key;
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, function (_, name) {
      return vars[name] == null ? "" : String(vars[name]);
    });
  }

  function apply() {
    try {
      document.documentElement.lang = lang === "th" ? "th" : "en";
      const titleKey = document.body && document.body.getAttribute("data-title-key");
      if (titleKey) document.title = t(titleKey);
      const nodes = document.querySelectorAll("[data-i18n], [data-i18n-aria], [data-i18n-content], [data-i18n-alt]");
      for (const el of nodes) {
        const ariaKey = el.getAttribute("data-i18n-aria");
        if (ariaKey) el.setAttribute("aria-label", t(ariaKey));
        const contentKey = el.getAttribute("data-i18n-content");
        if (contentKey) el.setAttribute("content", t(contentKey));
        const altKey = el.getAttribute("data-i18n-alt");
        if (altKey) el.setAttribute("alt", t(altKey));
        const key = el.getAttribute("data-i18n");
        if (!key) continue;
        let vars = null;
        const raw = el.getAttribute("data-i18n-vars");
        if (raw) {
          try { vars = JSON.parse(raw); } catch (e) { vars = null; }
        }
        const text = t(key, vars);
        if (el.getAttribute("data-i18n-html") === "text") el.textContent = text;
        else el.innerHTML = text;
      }
      for (const button of document.querySelectorAll(".lang [data-lang]")) {
        button.setAttribute("aria-pressed", button.getAttribute("data-lang") === lang ? "true" : "false");
      }
      window.dispatchEvent(new CustomEvent("spaceur-lang"));
    } finally {
      document.documentElement.classList.remove("i18n-wait");
    }
  }

  function setLang(next) {
    lang = next === "th" ? "th" : "en";
    try { localStorage.setItem("spaceur-lang", lang); } catch (e) {}
    apply();
  }

  function boot() {
    for (const button of document.querySelectorAll(".lang [data-lang]")) {
      button.addEventListener("click", function () {
        setLang(button.getAttribute("data-lang"));
      });
    }
    const header = document.querySelector(".top");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (header && toggle && nav) {
      function closeNav() {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
      toggle.addEventListener("click", function (event) {
        event.stopPropagation();
        const open = toggle.getAttribute("aria-expanded") === "true";
        header.classList.toggle("is-open", !open);
        toggle.setAttribute("aria-expanded", open ? "false" : "true");
      });
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) closeNav();
      });
      document.addEventListener("click", function (event) {
        if (!header.classList.contains("is-open")) return;
        if (header.contains(event.target)) return;
        closeNav();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeNav();
      });
      window.addEventListener("resize", function () {
        if (window.matchMedia("(min-width: 861px)").matches) closeNav();
      });
    }
    apply();
  }

  window.ToSnipI18n = {
    t: t,
    apply: apply,
    setLang: setLang,
    get lang() { return lang; },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
