var electronInstaller = require('electron-winstaller');
const path = require('path')

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './BCODECOLORS-win32-ia32',
    outputDirectory: './BCODECOLORS-installer',
    authors: 'Creativity & Progress',
    setupExe: 'bcodecolors.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
