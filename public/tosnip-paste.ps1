#requires -Version 5.1
# Resident helper for CMD, PowerShell, and Windows Terminal.
# Win+Shift+S, focus the terminal, press Ctrl+V.
# The screenshot is saved as a JPEG in C:\ToSnip and that path is typed into the command line.
# Files older than 5 minutes are deleted. The helper leaves the console after start. Stop from the tray menu.

param(
  [switch]$SelfTest
)

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false } catch {}

function Restart-ToSnipPaste {
  param([string]$Exe)
  $argList = @('-NoProfile', '-STA', '-ExecutionPolicy', 'Bypass', '-File', $PSCommandPath)
  if ($SelfTest) { $argList += '-SelfTest' }
  $child = Start-Process -FilePath $Exe -ArgumentList $argList -Wait -PassThru -NoNewWindow
  exit $child.ExitCode
}

if (-not [Environment]::Is64BitProcess) {
  Restart-ToSnipPaste (Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe')
}

if ([Threading.Thread]::CurrentThread.GetApartmentState() -ne 'STA') {
  Restart-ToSnipPaste (Join-Path $PSHOME 'powershell.exe')
}

try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}
[Net.ServicePointManager]::Expect100Continue = $false

$endpoint = 'https://tosnip.com/api/images'
$source = @'
using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace ToSnip {
  public class PasteHost {
    const int WH_KEYBOARD_LL = 13;
    const int WM_KEYDOWN = 0x0100;
    const int WM_MOUSEACTIVATE = 0x0021;
    const int MA_NOACTIVATE = 3;
    const int VK_CONTROL = 0x11;
    const int VK_MENU = 0x12;
    const int VK_SHIFT = 0x10;
    const int VK_V = 0x56;
    const int VK_RETURN = 0x0D;
    const uint KEYEVENTF_KEYUP = 0x0002;
    const uint KEYEVENTF_UNICODE = 0x0004;
    const uint CF_BITMAP = 2;
    const uint CF_DIB = 8;
    const uint CF_DIBV5 = 17;
    const int MaxBytes = 1500000;

    const string ShrinkText = "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E22\u0E48\u0E2D\u0E23\u0E39\u0E1B";
    const string SaveText = "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01";
    const string DoneText = "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E25\u0E49\u0E27";
    const string ReuseText = "\u0E43\u0E0A\u0E49\u0E44\u0E1F\u0E25\u0E4C\u0E40\u0E14\u0E34\u0E21";
    const string TooLargeText = "\u0E23\u0E39\u0E1B\u0E22\u0E31\u0E07\u0E43\u0E2B\u0E0D\u0E48\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B";
    const string NotImageText = "\u0E27\u0E32\u0E07\u0E44\u0E14\u0E49\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E23\u0E39\u0E1B";
    const string DiskText = "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E1F\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49";
    const string ServerText = "\u0E40\u0E0B\u0E34\u0E23\u0E4C\u0E1F\u0E40\u0E27\u0E2D\u0E23\u0E4C\u0E02\u0E31\u0E14\u0E02\u0E49\u0E2D\u0E07";
    const string CopiedText = "\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01\u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07\u0E41\u0E25\u0E49\u0E27 \u0E01\u0E14 Ctrl+V";
    const string ExitText = "\u0E2D\u0E2D\u0E01";
    const string AlreadyText = "\u0E15\u0E31\u0E27\u0E0A\u0E48\u0E27\u0E22\u0E17\u0E33\u0E07\u0E32\u0E19\u0E2D\u0E22\u0E39\u0E48\u0E41\u0E25\u0E49\u0E27";
    const string ReadyText = "\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E41\u0E25\u0E49\u0E27";
    const string HelpText = "\u0E01\u0E14 Ctrl+V \u0E43\u0E19 CMD, PowerShell \u0E2B\u0E23\u0E37\u0E2D Windows Terminal \u0E15\u0E2D\u0E19\u0E21\u0E35\u0E23\u0E39\u0E1B\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E08\u0E31\u0E1A\u0E20\u0E32\u0E1E \u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07\u0E44\u0E1F\u0E25\u0E4C\u0E08\u0E30\u0E16\u0E39\u0E01\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E25\u0E07\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\u0E04\u0E33\u0E2A\u0E31\u0E48\u0E07";
    const string StopText = "\u0E1B\u0E34\u0E14\u0E14\u0E49\u0E27\u0E22 Ctrl+C \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E21\u0E19\u0E39\u0E16\u0E32\u0E14 \u0E2D\u0E2D\u0E01";

    static volatile bool busy;
    static string lastHash = "";
    static string lastPath = "";
    static string storeRoot = "";
    static System.Windows.Forms.Timer sweeper;
    static IntPtr hook = IntPtr.Zero;
    static HookProc hookProc;
    static SynchronizationContext ui;
    static Mutex mutex;
    static bool uiReady;
    static NotifyIcon tray;
    public static string LastTyped;
    static volatile bool typedReady;

    delegate IntPtr HookProc(int nCode, IntPtr wParam, IntPtr lParam);

    [StructLayout(LayoutKind.Sequential)]
    struct KBDLLHOOKSTRUCT {
      public uint vkCode;
      public uint scanCode;
      public uint flags;
      public uint time;
      public UIntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    struct KEYBDINPUT {
      public ushort wVk;
      public ushort wScan;
      public uint dwFlags;
      public uint time;
      public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    struct MOUSEINPUT {
      public int dx;
      public int dy;
      public uint mouseData;
      public uint dwFlags;
      public uint time;
      public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    struct HARDWAREINPUT {
      public uint uMsg;
      public ushort wParamL;
      public ushort wParamH;
    }

    [StructLayout(LayoutKind.Explicit)]
    struct INPUT {
      [FieldOffset(0)] public uint type;
      [FieldOffset(8)] public KEYBDINPUT ki;
      [FieldOffset(8)] public MOUSEINPUT mi;
      [FieldOffset(8)] public HARDWAREINPUT hi;
    }

    [StructLayout(LayoutKind.Sequential)]
    struct RECT {
      public int Left;
      public int Top;
      public int Right;
      public int Bottom;
    }

    delegate bool ConsoleCtrlHandler(int ctrlType);
    static ConsoleCtrlHandler consoleCtrl;
    [DllImport("kernel32.dll")]
    static extern bool SetConsoleCtrlHandler(ConsoleCtrlHandler handler, bool add);
    [DllImport("kernel32.dll")]
    static extern bool FreeConsole();
    static bool OnConsoleCtrl(int ctrlType) {
      if (ctrlType == 2) {
        FreeConsole();
        return true;
      }
      return false;
    }

    [DllImport("user32.dll", SetLastError = true)]
    static extern IntPtr SetWindowsHookEx(int idHook, HookProc lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("user32.dll")]
    static extern bool UnhookWindowsHookEx(IntPtr hhk);
    [DllImport("user32.dll")]
    static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("user32.dll")]
    static extern short GetAsyncKeyState(int vKey);
    [DllImport("user32.dll")]
    static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);
    [DllImport("user32.dll")]
    static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    [DllImport("user32.dll")]
    static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")]
    static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
    [DllImport("user32.dll")]
    static extern bool OpenClipboard(IntPtr hWndNewOwner);
    [DllImport("user32.dll")]
    static extern bool CloseClipboard();
    [DllImport("user32.dll")]
    static extern bool IsClipboardFormatAvailable(uint format);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    static extern uint RegisterClipboardFormat(string lpszFormat);
    [DllImport("user32.dll", SetLastError = true)]
    static extern uint SendInput(uint nInputs, INPUT[] pInputs, int cbSize);
    [DllImport("user32.dll")]
    static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
    [DllImport("user32.dll")]
    static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);
    [DllImport("kernel32.dll")]
    static extern uint GetCurrentThreadId();
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern IntPtr OpenProcess(uint dwDesiredAccess, bool bInheritHandle, uint dwProcessId);
    [DllImport("kernel32.dll")]
    static extern bool CloseHandle(IntPtr hObject);
    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    static extern bool QueryFullProcessImageName(IntPtr hProcess, int dwFlags, StringBuilder lpExeName, ref int lpdwSize);

    public static int SelfTest(string api) {
      if (api == null) api = "";
      InitUi();
      string folder = Path.Combine(Path.GetTempPath(), "tosnip-selftest-" + Guid.NewGuid().ToString("N"));
      Directory.CreateDirectory(folder);
      storeRoot = folder;
      lastHash = "";
      lastPath = "";
      try {
        using (Bitmap wide = Solid(1200, 40, Color.FromArgb(34, 102, 204))) {
          using (Bitmap scaled = Draw(wide, 1000)) {
            if (scaled.Width != 1000 || scaled.Height != 33) {
              Console.WriteLine("FAIL scale " + scaled.Width + "x" + scaled.Height);
              return 1;
            }
            Console.WriteLine("SCALE " + scaled.Width + "x" + scaled.Height);
          }
          byte[] jpeg = EncodeJpeg(wide);
          if (jpeg.Length < 4 || jpeg[0] != 0xFF || jpeg[1] != 0xD8 || jpeg[2] != 0xFF) {
            Console.WriteLine("FAIL jpeg");
            return 1;
          }
          if (jpeg.Length > MaxBytes) {
            Console.WriteLine("FAIL jpeg-size " + jpeg.Length);
            return 1;
          }
          Console.WriteLine("JPEG " + jpeg.Length);
          string first = Publish(wide, null);
          string second = Publish(wide, null);
          if (first != second || !File.Exists(first)) {
            Console.WriteLine("FAIL dup " + first + " " + second);
            return 1;
          }
          if (first.IndexOf(folder) != 0 || !first.EndsWith(".jpg")) {
            Console.WriteLine("FAIL path " + first);
            return 1;
          }
          byte[] saved = File.ReadAllBytes(first);
          if (saved.Length < 4 || saved[0] != 0xFF || saved[1] != 0xD8 || saved[2] != 0xFF) {
            Console.WriteLine("FAIL saved");
            return 1;
          }
          Console.WriteLine("SAVE " + saved.Length);
          File.SetLastWriteTimeUtc(first, DateTime.UtcNow.AddMinutes(-6));
          string third = Publish(wide, null);
          if (third == first || File.Exists(first) || !File.Exists(third)) {
            Console.WriteLine("FAIL expire " + first + " " + third);
            return 1;
          }
          Console.WriteLine("EXPIRE");
        }
        if (Marshal.SizeOf(typeof(INPUT)) != 40) {
          Console.WriteLine("FAIL input-size " + Marshal.SizeOf(typeof(INPUT)));
          return 1;
        }
        string typed = ProbeTyping();
        Console.WriteLine("TYPE " + typed);
        if (typed.StartsWith("fail")) return 1;
        Console.WriteLine("SELFTEST_OK");
        return 0;
      } catch (Exception ex) {
        Console.WriteLine("FAIL " + ex.GetType().Name + " " + ex.Message);
        return 1;
      } finally {
        storeRoot = "";
        lastHash = "";
        lastPath = "";
        try { Directory.Delete(folder, true); } catch {}
      }
    }

    public static void Run(string api) {
      if (api == null) api = "";
      InitUi();
      bool created = false;
      try {
        mutex = new Mutex(true, "Local\\ToSnipPaste", out created);
      } catch (AbandonedMutexException) {
        created = true;
      }
      if (!created) {
        MessageBox.Show(AlreadyText, "ToSnip");
        return;
      }
      FreeConsole();
      ui = new WindowsFormsSynchronizationContext();
      SynchronizationContext.SetSynchronizationContext(ui);
      consoleCtrl = OnConsoleCtrl;
      SetConsoleCtrlHandler(consoleCtrl, true);
      InstallHook();
      StartSweeper();
      tray = new NotifyIcon();
      tray.Icon = SystemIcons.Application;
      tray.Visible = true;
      tray.Text = "ToSnip paste";
      ContextMenuStrip menu = new ContextMenuStrip();
      ToolStripMenuItem exit = new ToolStripMenuItem(ExitText);
      exit.Click += delegate { Shutdown(); };
      menu.Items.Add(exit);
      tray.ContextMenuStrip = menu;
      tray.ShowBalloonTip(4000, "ToSnip " + ReadyText, HelpText, ToolTipIcon.Info);
      try {
        Console.WriteLine(ReadyText);
        Console.WriteLine(HelpText);
        Console.WriteLine(StopText);
        Console.CancelKeyPress += delegate(object sender, ConsoleCancelEventArgs e) {
          e.Cancel = true;
          Shutdown();
        };
      } catch {}
      Application.Run();
      if (tray != null) {
        tray.Visible = false;
        tray.Dispose();
      }
      if (mutex != null) {
        try { mutex.ReleaseMutex(); } catch {}
        mutex.Dispose();
      }
    }

    static void Shutdown() {
      if (sweeper != null) {
        sweeper.Stop();
        sweeper.Dispose();
        sweeper = null;
      }
      Unhook();
      Application.Exit();
    }

    static void InitUi() {
      if (uiReady) return;
      Application.EnableVisualStyles();
      Application.SetCompatibleTextRenderingDefault(false);
      ServicePointManager.Expect100Continue = false;
      try { ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; } catch {}
      uiReady = true;
    }

    static void InstallHook() {
      if (hook != IntPtr.Zero) return;
      hookProc = HookCallback;
      hook = SetWindowsHookEx(WH_KEYBOARD_LL, hookProc, IntPtr.Zero, 0);
      if (hook == IntPtr.Zero) throw new InvalidOperationException("hook");
    }

    static void Unhook() {
      if (hook == IntPtr.Zero) return;
      UnhookWindowsHookEx(hook);
      hook = IntPtr.Zero;
    }

    static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
      try {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN) {
          KBDLLHOOKSTRUCT info = (KBDLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(KBDLLHOOKSTRUCT));
          if (info.vkCode == VK_V && Down(VK_CONTROL) && !Down(VK_MENU)) {
            IntPtr fg = GetForegroundWindow();
            if (IsTerminal(fg) && (busy || ClipboardHasImage())) {
              if (!busy) {
                busy = true;
                IntPtr target = fg;
                ui.Post(delegate(object state) {
                  StartUpload((IntPtr)state);
                }, target);
              }
              return (IntPtr)1;
            }
          }
        }
      } catch {}
      return CallNextHookEx(hook, nCode, wParam, lParam);
    }

    static void StartUpload(IntPtr hwnd) {
      Bitmap bmp = null;
      try {
        bmp = ReadClipboardBitmap();
        if (bmp == null) {
          busy = false;
          return;
        }
        Toast toast = Toast.ShowNear(hwnd);
        ThreadPool.QueueUserWorkItem(delegate {
          try { Work(bmp, hwnd, toast); }
          finally {
            bmp.Dispose();
            busy = false;
          }
        });
      } catch {
        if (bmp != null) bmp.Dispose();
        busy = false;
      }
    }

    static void Work(Bitmap bmp, IntPtr hwnd, Toast toast) {
      try {
        string hash = HashBitmap(bmp);
        string path;
        if (hash.Length > 0 && hash == lastHash && Fresh(lastPath)) {
          path = lastPath;
          toast.Status(ReuseText, 100, path);
        } else {
          toast.Status(ShrinkText, -1, "");
          byte[] jpeg = EncodeJpeg(bmp);
          if (jpeg.Length > MaxBytes) throw new InvalidOperationException("too_large");
          toast.Status(SaveText, 100, "");
          path = SaveLocal(jpeg);
          if (hash.Length > 0) {
            lastHash = hash;
            lastPath = path;
          }
          toast.Status(DoneText, 100, path);
        }
        string typed = ForTerminal(path);
        WaitModifiersReleased();
        if (GetForegroundWindow() == hwnd) {
          uint sent = TypeText(typed);
          LastTyped = typed;
          typedReady = true;
          if (sent != (uint)(typed.Length * 2)) {
            toast.Fallback(typed);
            return;
          }
          toast.CloseSoon(900);
        } else {
          LastTyped = typed;
          typedReady = true;
          toast.Fallback(typed);
        }
      } catch (Exception ex) {
        toast.Fail(MapMessage(ex));
      }
    }

    static string Publish(Bitmap bmp, Action<int> progress) {
      string hash = HashBitmap(bmp);
      if (hash.Length > 0 && hash == lastHash && Fresh(lastPath)) return lastPath;
      if (progress != null) progress(0);
      byte[] jpeg = EncodeJpeg(bmp);
      if (jpeg.Length > MaxBytes) throw new InvalidOperationException("too_large");
      string path = SaveLocal(jpeg);
      if (hash.Length > 0) {
        lastHash = hash;
        lastPath = path;
      }
      if (progress != null) progress(100);
      return path;
    }

    static string StoreDirectory() {
      if (storeRoot.Length > 0) {
        Directory.CreateDirectory(storeRoot);
        return storeRoot;
      }
      string drive = Environment.GetEnvironmentVariable("SystemDrive");
      if (drive == null || drive.Length < 2) drive = "C:";
      string primary = drive + "\\ToSnip";
      try {
        Directory.CreateDirectory(primary);
        string marker = Path.Combine(primary, "tosnip.txt");
        if (!File.Exists(marker)) File.WriteAllText(marker, "tosnip\r\n", Encoding.ASCII);
        return primary;
      } catch {
        string fallback = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "ToSnip", "images");
        Directory.CreateDirectory(fallback);
        string marker = Path.Combine(fallback, "tosnip.txt");
        if (!File.Exists(marker)) File.WriteAllText(marker, "tosnip\r\n", Encoding.ASCII);
        storeRoot = fallback;
        return fallback;
      }
    }

    static void StartSweeper() {
      sweeper = new System.Windows.Forms.Timer();
      sweeper.Interval = 30000;
      sweeper.Tick += delegate {
        ThreadPool.QueueUserWorkItem(delegate {
          try { Sweep(StoreDirectory()); } catch {}
        });
      };
      sweeper.Start();
    }

    static void Sweep(string dir) {
      if (!Directory.Exists(dir)) return;
      string[] files = Directory.GetFiles(dir, "*.jpg");
      DateTime cutoff = DateTime.UtcNow.AddSeconds(-300);
      for (int i = 0; i < files.Length; i++) {
        try {
          if (IsOurs(files[i]) && File.GetLastWriteTimeUtc(files[i]) < cutoff) File.Delete(files[i]);
        } catch {}
      }
    }

    static bool Fresh(string path) {
      if (path == null || path.Length == 0 || !File.Exists(path)) return false;
      return File.GetLastWriteTimeUtc(path) >= DateTime.UtcNow.AddSeconds(-300);
    }

    static bool IsOurs(string path) {
      string name = Path.GetFileName(path);
      if (name == null || name.Length != 10 || !name.EndsWith(".jpg")) return false;
      for (int i = 0; i < 6; i++) {
        char c = name[i];
        if (!((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9'))) return false;
      }
      return true;
    }

    static string NewName() {
      const string alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
      byte[] buf = new byte[6];
      using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider()) rng.GetBytes(buf);
      char[] chars = new char[6];
      for (int i = 0; i < 6; i++) chars[i] = alphabet[buf[i] % alphabet.Length];
      return new string(chars);
    }

    static string SaveLocal(byte[] jpeg) {
      string dir = StoreDirectory();
      Sweep(dir);
      string path = Path.Combine(dir, NewName() + ".jpg");
      int guard = 0;
      while (File.Exists(path) && guard < 5) {
        guard++;
        path = Path.Combine(dir, NewName() + ".jpg");
      }
      File.WriteAllBytes(path, jpeg);
      return path;
    }

    static string ForTerminal(string path) {
      if (path.IndexOf(' ') >= 0) return "\"" + path + "\"";
      return path;
    }

    static string MapMessage(Exception ex) {
      if (ex.Message == "too_large") return TooLargeText;
      if (ex.Message == "not_image") return NotImageText;
      if (ex is IOException || ex is UnauthorizedAccessException) return DiskText;
      return ServerText;
    }

    static Bitmap Draw(Bitmap source, int maxWidth) {
      int w = source.Width;
      int h = source.Height;
      if (w > maxWidth) {
        h = Math.Max(1, (int)Math.Round(h * (maxWidth / (double)w)));
        w = maxWidth;
      }
      Bitmap bmp = new Bitmap(w, h, PixelFormat.Format24bppRgb);
      using (Graphics g = Graphics.FromImage(bmp)) {
        g.Clear(Color.White);
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
        g.DrawImage(source, 0, 0, w, h);
      }
      return bmp;
    }

    static byte[] EncodeJpeg(Bitmap source) {
      int cap = Math.Min(source.Width, 1000);
      long[] qualities = new long[] { 85L, 70L, 55L, 40L };
      byte[] last = null;
      int qIndex = 0;
      int guard = 0;
      while (guard < 10) {
        guard++;
        long quality = qualities[Math.Min(qIndex, qualities.Length - 1)];
        using (Bitmap canvas = Draw(source, cap)) last = SaveJpeg(canvas, quality);
        if (last.Length <= MaxBytes) return last;
        if (qIndex < qualities.Length - 1) {
          qIndex++;
          continue;
        }
        if (cap <= 320) return last;
        cap = Math.Max(320, (int)(cap * 0.75));
        qIndex = 1;
      }
      return last;
    }

    static byte[] SaveJpeg(Image image, long quality) {
      ImageCodecInfo codec = null;
      ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
      for (int i = 0; i < codecs.Length; i++) {
        if (codecs[i].MimeType == "image/jpeg") codec = codecs[i];
      }
      if (codec == null) throw new InvalidOperationException("no-jpeg");
      using (EncoderParameters enc = new EncoderParameters(1)) {
        enc.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
        using (MemoryStream ms = new MemoryStream()) {
          image.Save(ms, codec, enc);
          return ms.ToArray();
        }
      }
    }

    static string HashBitmap(Bitmap bmp) {
      try {
        Rectangle rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
        BitmapData data = bmp.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        try {
          int bytes = Math.Abs(data.Stride) * bmp.Height;
          byte[] raw = new byte[bytes];
          Marshal.Copy(data.Scan0, raw, 0, bytes);
          using (SHA256 sha = SHA256.Create()) {
            byte[] hash = sha.ComputeHash(raw);
            StringBuilder sb = new StringBuilder(hash.Length * 2);
            for (int i = 0; i < hash.Length; i++) sb.Append(hash[i].ToString("x2"));
            return sb.ToString();
          }
        } finally {
          bmp.UnlockBits(data);
        }
      } catch {
        return "";
      }
    }

    static Bitmap Solid(int width, int height, Color color) {
      Bitmap bmp = new Bitmap(width, height, PixelFormat.Format24bppRgb);
      using (Graphics g = Graphics.FromImage(bmp)) g.Clear(color);
      return bmp;
    }

    static bool Down(int vk) {
      return (GetAsyncKeyState(vk) & 0x8000) != 0;
    }

    static bool ClipboardHasImage() {
      if (!OpenClipboard(IntPtr.Zero)) return false;
      try {
        if (IsClipboardFormatAvailable(CF_BITMAP)) return true;
        if (IsClipboardFormatAvailable(CF_DIB)) return true;
        if (IsClipboardFormatAvailable(CF_DIBV5)) return true;
        uint png = RegisterClipboardFormat("PNG");
        if (png != 0 && IsClipboardFormatAvailable(png)) return true;
        return false;
      } finally {
        CloseClipboard();
      }
    }

    static Bitmap ReadClipboardBitmap() {
      try {
        if (Clipboard.ContainsImage()) {
          Image img = Clipboard.GetImage();
          if (img != null) {
            Bitmap copy = new Bitmap(img);
            img.Dispose();
            return copy;
          }
        }
      } catch {}
      try {
        if (Clipboard.ContainsData("PNG")) {
          MemoryStream ms = Clipboard.GetData("PNG") as MemoryStream;
          if (ms != null) {
            byte[] bytes = ms.ToArray();
            using (MemoryStream copy = new MemoryStream(bytes))
            using (Image img = Image.FromStream(copy)) return new Bitmap(img);
          }
        }
      } catch {}
      return null;
    }

    static bool IsTerminal(IntPtr hwnd) {
      if (hwnd == IntPtr.Zero) return false;
      string cls = ClassName(hwnd);
      if (cls == "ConsoleWindowClass") return true;
      if (cls == "CASCADIA_HOSTING_WINDOW_CLASS") return true;
      string proc = ProcessFileName(hwnd);
      if (proc == "windowsterminal.exe" || proc == "cmd.exe" || proc == "powershell.exe" || proc == "pwsh.exe") return true;
      return false;
    }

    static string ClassName(IntPtr hwnd) {
      StringBuilder sb = new StringBuilder(256);
      GetClassName(hwnd, sb, sb.Capacity);
      return sb.ToString();
    }

    static string ProcessFileName(IntPtr hwnd) {
      uint pid;
      GetWindowThreadProcessId(hwnd, out pid);
      IntPtr handle = OpenProcess(0x1000, false, pid);
      if (handle == IntPtr.Zero) return "";
      try {
        StringBuilder sb = new StringBuilder(1024);
        int size = sb.Capacity;
        if (!QueryFullProcessImageName(handle, 0, sb, ref size)) return "";
        return Path.GetFileName(sb.ToString()).ToLowerInvariant();
      } finally {
        CloseHandle(handle);
      }
    }

    static void WaitModifiersReleased() {
      int spins = 0;
      while (spins < 80 && (Down(VK_CONTROL) || Down(VK_SHIFT) || Down(VK_V))) {
        Thread.Sleep(25);
        spins++;
      }
      Thread.Sleep(40);
    }

    static uint TypeText(string text) {
      INPUT[] inputs = new INPUT[text.Length * 2];
      for (int i = 0; i < text.Length; i++) {
        ushort ch = text[i];
        inputs[i * 2].type = 1;
        inputs[i * 2].ki.wScan = ch;
        inputs[i * 2].ki.dwFlags = KEYEVENTF_UNICODE;
        inputs[i * 2 + 1].type = 1;
        inputs[i * 2 + 1].ki.wScan = ch;
        inputs[i * 2 + 1].ki.dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP;
      }
      return SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(INPUT)));
    }

    static void Tap(ushort vk) {
      INPUT[] inputs = new INPUT[2];
      inputs[0].type = 1;
      inputs[0].ki.wVk = vk;
      inputs[1].type = 1;
      inputs[1].ki.wVk = vk;
      inputs[1].ki.dwFlags = KEYEVENTF_KEYUP;
      SendInput(2, inputs, Marshal.SizeOf(typeof(INPUT)));
    }

    static void ChordCtrlV() {
      INPUT[] inputs = new INPUT[4];
      inputs[0].type = 1;
      inputs[0].ki.wVk = VK_CONTROL;
      inputs[1].type = 1;
      inputs[1].ki.wVk = VK_V;
      inputs[2].type = 1;
      inputs[2].ki.wVk = VK_V;
      inputs[2].ki.dwFlags = KEYEVENTF_KEYUP;
      inputs[3].type = 1;
      inputs[3].ki.wVk = VK_CONTROL;
      inputs[3].ki.dwFlags = KEYEVENTF_KEYUP;
      SendInput(4, inputs, Marshal.SizeOf(typeof(INPUT)));
    }

    static bool ForceForeground(IntPtr hwnd) {
      IntPtr fg = GetForegroundWindow();
      uint unused;
      uint fgThread = GetWindowThreadProcessId(fg, out unused);
      uint targetThread = GetWindowThreadProcessId(hwnd, out unused);
      uint thisThread = GetCurrentThreadId();
      bool a = AttachThreadInput(thisThread, fgThread, true);
      bool b = AttachThreadInput(thisThread, targetThread, true);
      keybd_event(VK_MENU, 0, 0, UIntPtr.Zero);
      bool ok = SetForegroundWindow(hwnd);
      keybd_event(VK_MENU, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
      if (b) AttachThreadInput(thisThread, targetThread, false);
      if (a) AttachThreadInput(thisThread, fgThread, false);
      return ok;
    }

    static string ProbeTyping() {
      string id = Guid.NewGuid().ToString("N");
      string title = "tosnip-type-" + id;
      string folder = Path.GetTempPath();
      string script = Path.Combine(folder, "tosnip-type-" + id + ".ps1");
      string output = Path.Combine(folder, "tosnip-type-" + id + ".txt");
      File.WriteAllText(script, "[Console]::Title = '" + title + "'\r\n$line = [Console]::ReadLine()\r\n[IO.File]::WriteAllText('" + output.Replace("'", "''") + "', $line)\r\n", Encoding.ASCII);
      Process proc = null;
      string savedText = null;
      bool hadText = false;
      Bitmap savedImage = null;
      bool created = false;
      Mutex probeMutex = null;
      try {
        try {
          probeMutex = new Mutex(true, "Local\\ToSnipPaste", out created);
        } catch (AbandonedMutexException) {
          created = true;
        }
        if (!created) return "skip helper-running";
        ProcessStartInfo psi = new ProcessStartInfo();
        psi.FileName = Path.Combine(Environment.SystemDirectory, "WindowsPowerShell\\v1.0\\powershell.exe");
        psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -File \"" + script + "\"";
        psi.UseShellExecute = true;
        psi.WindowStyle = ProcessWindowStyle.Normal;
        proc = Process.Start(psi);
        IntPtr hwnd = IntPtr.Zero;
        for (int i = 0; i < 50 && hwnd == IntPtr.Zero; i++) {
          Thread.Sleep(100);
          hwnd = FindWindow(null, title);
        }
        if (hwnd == IntPtr.Zero) return "skip no-window";
        Console.WriteLine("WINDOW " + ClassName(hwnd));
        ForceForeground(hwnd);
        Thread.Sleep(300);
        if (GetForegroundWindow() != hwnd) return "skip no-focus";
        try {
          if (Clipboard.ContainsText()) {
            savedText = Clipboard.GetText();
            hadText = true;
          }
        } catch {}
        try {
          if (Clipboard.ContainsImage()) savedImage = ReadClipboardBitmap();
        } catch {}
        using (Bitmap shot = Solid(180, 30, Color.FromArgb(204, 34, 34))) Clipboard.SetImage(shot);
        ui = new WindowsFormsSynchronizationContext();
        SynchronizationContext.SetSynchronizationContext(ui);
        LastTyped = null;
        typedReady = false;
        busy = false;
        InstallHook();
        string result = "fail timeout";
        Pump host = new Pump();
        host.Show();
        System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer();
        int ticks = 0;
        bool entered = false;
        timer.Interval = 150;
        timer.Tick += delegate {
          ticks++;
          try {
            if (!entered && typedReady) {
              entered = true;
              ThreadPool.QueueUserWorkItem(delegate {
                Thread.Sleep(120);
                Tap(VK_RETURN);
              });
            }
            if (File.Exists(output)) {
              string line = File.ReadAllText(output).Trim();
              result = line == LastTyped ? "ok " + line : "fail line " + line;
              timer.Stop();
              host.Close();
            } else if (ticks > 100) {
              result = typedReady ? "fail no-line" : "fail no-type";
              timer.Stop();
              host.Close();
            }
          } catch (Exception ex) {
            result = "fail " + ex.Message;
            timer.Stop();
            try { host.Close(); } catch {}
          }
        };
        ThreadPool.QueueUserWorkItem(delegate {
          Thread.Sleep(400);
          ForceForeground(hwnd);
          Thread.Sleep(200);
          if (GetForegroundWindow() == hwnd) ChordCtrlV();
        });
        timer.Start();
        Application.Run(host);
        timer.Dispose();
        return result;
      } finally {
        Unhook();
        busy = false;
        try {
          if (savedImage != null) Clipboard.SetImage(savedImage);
          else if (hadText && savedText != null) Clipboard.SetText(savedText);
        } catch {}
        if (savedImage != null) savedImage.Dispose();
        if (proc != null && !proc.HasExited) {
          try {
            Process killer = Process.Start(new ProcessStartInfo("taskkill", "/PID " + proc.Id + " /T /F") {
              CreateNoWindow = true,
              UseShellExecute = false
            });
            if (killer != null) killer.WaitForExit(3000);
          } catch {}
        }
        try { if (File.Exists(script)) File.Delete(script); } catch {}
        try { if (File.Exists(output)) File.Delete(output); } catch {}
        if (created && probeMutex != null) {
          try { probeMutex.ReleaseMutex(); } catch {}
        }
        if (probeMutex != null) probeMutex.Dispose();
      }
    }

    class Pump : Form {
      protected override bool ShowWithoutActivation { get { return true; } }
      protected override CreateParams CreateParams {
        get {
          CreateParams cp = base.CreateParams;
          cp.ExStyle |= 0x08000000;
          cp.ExStyle |= 0x00000080;
          return cp;
        }
      }
      public Pump() {
        FormBorderStyle = FormBorderStyle.None;
        ShowInTaskbar = false;
        StartPosition = FormStartPosition.Manual;
        Location = new Point(-32000, -32000);
        Size = new Size(1, 1);
        Opacity = 0;
      }
    }

    class Bar : Control {
      public int Percent;
      public bool Marquee;
      int offset;
      System.Windows.Forms.Timer timer;
      readonly SolidBrush track = new SolidBrush(Color.FromArgb(229, 221, 208));
      readonly SolidBrush fill = new SolidBrush(Color.FromArgb(13, 106, 75));

      public Bar() {
        Height = 18;
        SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);
        timer = new System.Windows.Forms.Timer();
        timer.Interval = 40;
        timer.Tick += delegate {
          offset = (offset + 8) % 220;
          Invalidate();
        };
      }

      public void SetMarquee(bool on) {
        Marquee = on;
        timer.Enabled = on;
        Invalidate();
      }

      protected override void OnPaint(PaintEventArgs e) {
        e.Graphics.FillRectangle(track, 0, 0, Width, Height);
        if (Marquee) {
          int w = Math.Max(24, Width * 38 / 100);
          int x = -w + (Width + w) * offset / 220;
          e.Graphics.FillRectangle(fill, x, 0, w, Height);
        } else {
          int w = Width * Math.Max(0, Math.Min(100, Percent)) / 100;
          e.Graphics.FillRectangle(fill, 0, 0, w, Height);
        }
      }

      protected override void Dispose(bool disposing) {
        if (disposing) {
          timer.Stop();
          timer.Dispose();
          track.Dispose();
          fill.Dispose();
        }
        base.Dispose(disposing);
      }
    }

    class Toast : Form {
      readonly Label caption = new Label();
      readonly Label sub = new Label();
      readonly Bar bar = new Bar();
      System.Windows.Forms.Timer closer;

      Toast() {
        FormBorderStyle = FormBorderStyle.None;
        ShowInTaskbar = false;
        TopMost = true;
        StartPosition = FormStartPosition.Manual;
        BackColor = Color.FromArgb(255, 253, 249);
        ClientSize = new Size(460, 112);
        Font font;
        try { font = new Font("Segoe UI", 16f, FontStyle.Bold); }
        catch { font = SystemFonts.MessageBoxFont; }
        caption.Font = font;
        caption.ForeColor = Color.FromArgb(28, 27, 24);
        caption.Bounds = new Rectangle(16, 14, 428, 32);
        sub.Font = new Font("Consolas", 10f);
        sub.ForeColor = Color.FromArgb(95, 90, 82);
        sub.Bounds = new Rectangle(16, 48, 428, 22);
        bar.Bounds = new Rectangle(16, 78, 428, 18);
        Controls.Add(caption);
        Controls.Add(sub);
        Controls.Add(bar);
      }

      protected override bool ShowWithoutActivation { get { return true; } }

      protected override CreateParams CreateParams {
        get {
          CreateParams cp = base.CreateParams;
          cp.ExStyle |= 0x08000000;
          cp.ExStyle |= 0x00000080;
          return cp;
        }
      }

      protected override void WndProc(ref Message m) {
        if (m.Msg == WM_MOUSEACTIVATE) {
          m.Result = (IntPtr)MA_NOACTIVATE;
          return;
        }
        base.WndProc(ref m);
      }

      public static Toast ShowNear(IntPtr hwnd) {
        Toast toast = new Toast();
        RECT rect;
        int x = 80;
        int y = 80;
        if (GetWindowRect(hwnd, out rect)) {
          x = rect.Left + Math.Max(12, (rect.Right - rect.Left - toast.Width) / 2);
          y = rect.Top + 36;
        }
        toast.Location = new Point(x, y);
        toast.Show();
        return toast;
      }

      public void Status(string text, int percent, string detail) {
        if (IsDisposed) return;
        try {
          BeginInvoke((Action)delegate {
            caption.Text = percent < 0 ? text : text + " " + percent + "%";
            if (detail.Length > 0) sub.Text = detail;
            bar.SetMarquee(percent < 0);
            if (percent >= 0) bar.Percent = percent;
            bar.Invalidate();
          });
        } catch (InvalidOperationException) {}
      }

      public void Fallback(string url) {
        if (IsDisposed) return;
        try {
          BeginInvoke((Action)delegate {
            try { Clipboard.SetText(url); } catch {}
            caption.Text = CopiedText;
            sub.Text = url;
            bar.SetMarquee(false);
            bar.Percent = 100;
            CloseSoon(4000);
          });
        } catch (InvalidOperationException) {}
      }

      public void Fail(string text) {
        if (IsDisposed) return;
        try {
          BeginInvoke((Action)delegate {
            caption.Text = text;
            caption.ForeColor = Color.FromArgb(141, 44, 44);
            bar.SetMarquee(false);
            bar.Percent = 0;
            CloseSoon(3500);
          });
        } catch (InvalidOperationException) {}
      }

      public void CloseSoon(int ms) {
        Action start = delegate {
          if (IsDisposed) return;
          if (closer != null) {
            closer.Stop();
            closer.Dispose();
          }
          closer = new System.Windows.Forms.Timer();
          closer.Interval = ms;
          closer.Tick += delegate {
            closer.Stop();
            if (!IsDisposed) Close();
          };
          closer.Start();
        };
        try {
          if (!IsHandleCreated || InvokeRequired) BeginInvoke(start);
          else start();
        } catch (InvalidOperationException) {}
      }

      protected override void OnFormClosed(FormClosedEventArgs e) {
        if (closer != null) {
          closer.Stop();
          closer.Dispose();
          closer = null;
        }
        base.OnFormClosed(e);
      }
    }
  }
}
'@

Add-Type -TypeDefinition $source -ReferencedAssemblies @('System.Windows.Forms', 'System.Drawing') -Language CSharp

if ($SelfTest) {
  $code = [ToSnip.PasteHost]::SelfTest($endpoint)
  exit $code
}

[ToSnip.PasteHost]::Run($endpoint)
