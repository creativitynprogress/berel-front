var electronInstaller = require('electron-winstaller');
const path = require('path')

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: '/electron/b-code',
    outputDirectory: '/tmp/build/b-code',
    authors: 'Creativity & Progress',
    exe: 'colors.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
