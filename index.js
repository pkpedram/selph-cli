#!/usr/bin/env node

import cp from 'child_process';
import chalk from 'chalk';
import { selphBG } from 'selph-bg';
import fs from 'fs-extra'
import open from 'open';

const arg = process.argv.slice(2)[0];


const commands = [
    {
        title: 'dev',
        log: '🟥 Selph - Starting Dev Server...',
        selph: true,
        mainCommand: 'cd ../frontend &&  npm start',
        execCommand: ' npm run dev',
        functions: [selphBG.genEnv, selphBG.genAppJs, selphBG.genModels, selphBG.genCg, selphBG.genRg, selphBG.genSg]

    },
    {
        title: 'build',
        log: '🟥 Selph - Starting Build Process...',
        selph: false,
        mainCommand: "",
        execCommand: 'npm run build'
    },
    {
        title: 'start',
        selph: true,
        log: '🟥 Selph - Starting Frontend Application & Backend Server...',
        mainCommand: "(cd ../frontend &&  npm start)",
        execCommand: 'npm start',
        functions: [selphBG.genEnv, selphBG.genAppJs, selphBG.genModels, selphBG.genCg, selphBG.genRg, selphBG.genSg]
    },
    {
        title: 'start-frontend',
        selph: false,
        log: '🟥 Selph - Starting Frontend...',
        mainCommand: "",
        execCommand: 'cd frontend && npm start'
    },
    {
        title: 'start-backend',
        selph: true,
        log: '🟥 Selph - Starting Backend Server...',
        mainCommand: "npm start",
        execCommand: '',
        functions: [selphBG.genEnv, selphBG.genAppJs, selphBG.genModels, selphBG.genCg, selphBG.genRg, selphBG.genSg]

    },
    {
        title: 'create-admin',
        selph: false,
        log: '🟥 Selph - Creating admin/superuser',
        mainCommand: "",
        execCommand: 'cd backend && npm run createsuperuser',
        functions: null
    },
]

let sh;
const main = async () => {
    let config = await JSON.parse(fs.readFileSync('selph.config.json'));

    if(config){
    if(commands.map(itm => itm.title).includes(arg)){

          
        
        let command = commands.find(itm => itm.title == arg);

        if(command.selph){
            try {
                console.log(command.log)
              await  command.functions?.map(async mdl => {
                    let log = await mdl(config, 'backend/')
                   if(log){
                    console.log(log)
                   }
                })
              
                 sh = cp.exec(command.mainCommand + ' &' +command.execCommand, {
                    cwd: 'backend'
                },(error, stdout, stderr) => {
                    if (error) {
                        console.error(`An error occurred: `, error);
                    } else {
                        console.log(`stdout:`, stdout);
                        console.log(`stderr:`, stderr);
                    }
                })
                open(`${config?.https ? 'https' : 'http'}://localhost:${config.apiPort}/swagger`)
                 
            } catch (error) {

                
                throw error
            }
    
        }else{
            cp.execSync(command.execCommand, {stdio: 'inherit', stdin: "inherit"});
        }
    }else{
        console.log(chalk.red(`🚫 Sorry, This command (${arg}) is not supported by Selph...`))
    }
}else{
    console.log(chalk.red(`🚫 There is no selph config in this directory...`))
}
}

await main()


// process.exit()

