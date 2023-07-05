#!/usr/bin/env node

import cp from 'child_process';

import chalk from 'chalk';
import * as url from 'url';
import path from 'path';


const arg = process.argv.slice(2)[0];



const commands = [
    {
        title: 'dev',
        log: '🟥 Selph - Starting Dev Server...',
        selph: true,
        mainCommand: 'cd backend && npm run dev',
        execCommand: 'cd frontend &&  npm start && cd ../'
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
        mainCommand: "cd backend && npm start",
        execCommand: 'cd frontend &&  npm start && cd ../'
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
        mainCommand: "cd backend && npm start && cd ../",
        execCommand: ''
    },
]

const main = async () => {

    if(commands.map(itm => itm.title).includes(arg)){
        let command = commands.find(itm => itm.title == arg);
        if(command.selph){
            try {
                console.log(command.log)
          
            console.log(cp.execSync(command.mainCommand + ' &' +command.execCommand, {stdio: 'inherit'}))
            } catch (error) {
                throw error
            }
    
        }else{
            cp.execSync(command.execCommand, {stdio: 'inherit'});
        }
    }else{
        console.log(chalk.red(`🚫 Sorry, This command (${arg}) is not supported by Selph...`))
    }
}

await main()

process.exit()

