const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const androidDir = path.join(root, 'android');

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: false
  });
  if (res.error) throw res.error;
  if (res.status !== 0) process.exit(res.status ?? 1);
}

function main() {
  if (!fs.existsSync(androidDir)) {
    process.stderr.write('Android project not found. Run: npm run android:init\n');
    process.exit(1);
  }

  const isWin = process.platform === 'win32';
  const wrapper = isWin ? 'gradlew.bat' : './gradlew';
  const wrapperPath = path.join(androidDir, wrapper);

  if (!fs.existsSync(wrapperPath)) {
    process.stderr.write(`Gradle wrapper not found at ${wrapperPath}. Try running: npx cap sync android\n`);
    process.exit(1);
  }

  if (!isWin) {
    try {
      fs.chmodSync(wrapperPath, 0o755);
    } catch (_) {
      // ignore
    }
  }

  if (isWin) {
    run('cmd.exe', ['/c', 'gradlew.bat', 'assembleDebug'], androidDir);
  } else {
    run(wrapperPath, ['assembleDebug'], androidDir);
  }
}

main();
