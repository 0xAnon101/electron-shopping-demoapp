const { app, BrowserWindow,Menu,ipcMain } = require('electron');
const url = require('url');
const path = require('path');

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

app.on('ready',()=>{
    mainWindow = new BrowserWindow({ });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //build menu from template
    const mainMenu =  Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
    //quit app when closed
    mainWindow.on('closed',()=>{
        app.quit();
    })
});



//Handle Create Add window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title:'Add Shopping List Item'
     });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname,'/addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //garbage collection
    addWindow.on('closed',()=>{
        addWindow =  null;
    })
}

//catch item add 
ipcMain.on('item:add',(e,item)=>{
    mainWindow.webContents.send('item:add',item);
    addWindow.close(); 
});


//create a menu template 
const mainMenuTemplate =  [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Item',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 
                'Ctrl+Q',
                click() {
                    app.quit();
                }
            },
           
        ]
    }
];


//if mac add empty object to menu
if(process.platform  === 'darwin') {
    mainMenuTemplate.unshift({});
}

//add developer tool if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 
                'Ctrl+I',
                click(item,focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload' 
            }
        ]
    });
}