import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('scoop manifest installs the published helper and does not shim it', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'bucket', 'tosnip.json'), 'utf8'));
  const helper = fs.readFileSync(path.join(root, 'public', 'tosnip-paste.ps1'));
  const hash = createHash('sha256').update(helper).digest('hex');
  assert.equal(manifest.version, '1.0.0');
  assert.equal(manifest.homepage, 'https://tosnip.com');
  assert.equal(manifest.license, 'MIT');
  assert.equal(manifest.hash, hash);
  assert.equal(
    manifest.url,
    'https://raw.githubusercontent.com/tana360/tosnip/9d966ef39b5d0c6e083f2f48d09a012a6dc028f3/public/tosnip-paste.ps1'
  );
  assert.equal(Object.hasOwn(manifest, 'bin'), false);
  const install = manifest.post_install.join('\n');
  assert.match(install, /Join-Path \$dir 'tosnip-paste\.ps1'/);
  assert.match(install, /ToSnip paste\.lnk/);
  assert.doesNotMatch(install, /LOCALAPPDATA/);
  const remove = manifest.post_uninstall.join('\n');
  assert.match(remove, /if \(\$cmd -ne 'uninstall'\) \{ return \}/);
  assert.ok(remove.indexOf("if ($cmd -ne 'uninstall') { return }") < remove.indexOf('Remove-MarkedPictures'));
  const stop = manifest.pre_uninstall.join('\n');
  assert.match(stop, /tosnip-paste\.ps1/);
  assert.match(stop, /ProcessId -ne \$PID/);
});
