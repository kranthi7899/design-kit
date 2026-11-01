// Page- and file-controlled text must not reach a terminal raw: ESC/OSC/CSI sequences can rewrite the screen,
// bidi controls can reorder what a reader sees, and separators can forge extra lines.
// Tab (\t) and newline (\n) pass through clean(); every other C0, DEL and C1 control, the bidi
// overrides/isolates (U+202A-202E, U+2066-2069, U+061C), U+2028/2029 and zero-width characters become '?'.
const BAD = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069\u061c\u2028\u2029\u200b-\u200f\u2060\ufeff]/g;
export const clean = (s) => String(s ?? '').replace(BAD, '?');
/** clean() for single-line fields (messages, matches, paths, selectors): newlines and carriage returns become spaces. */
export const cleanLine = (s) => clean(String(s ?? '').replace(/[\r\n]/g, ' '));

const FS_SYSCALLS = /^(open|mkdir|write|scandir|stat|lstat|realpath|unlink|access|rename|close)$/;
/** Error code for the CLIs: a HarnessError code as is, a filesystem syscall failure E_IO, anything else E_BROWSER. */
export const errCode = (e) => {
  if (e && typeof e.code === 'string' && e.code.startsWith('E_')) return e.code;
  if (e && typeof e.syscall === 'string' && FS_SYSCALLS.test(e.syscall)) return 'E_IO';
  return 'E_BROWSER';
};
