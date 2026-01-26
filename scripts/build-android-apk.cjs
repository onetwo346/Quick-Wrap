const { execSync } = require('child_process');
const path = require('path');

console.log('Building Android APK...');

const androidDir = path.join(__dirname, '../android');

try {
    process.chdir(androidDir);
    
    console.log('Running Gradle build...');
    const isWindows = process.platform === 'win32';
    const gradleCmd = isWindows ? 'gradlew.bat assembleDebug' : './gradlew assembleDebug';
    execSync(gradleCmd, { stdio: 'inherit' });
    
    console.log('\n✅ APK built successfully!');
    console.log('Location: android/app/build/outputs/apk/debug/app-debug.apk');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
