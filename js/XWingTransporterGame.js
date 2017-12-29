import GameProcess from './GameProcess';
import {UI_OPTIONS} from './Constants';

class XWingTransporterGame {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.menuScreen = document.querySelector('#menu-screen');
        this.menu=document.querySelector('#menu');
        this.menuSound=document.querySelector('#menuSound');
        this.scoreBlock=document.querySelector('#score');

        this.historyButton=document.querySelector('#history');
        this.playButton=document.querySelector('#play');
        this.aboutButton=document.querySelector('#about');

        this.setPlayListener();
    }

    setPlayListener() {
        this.playButton.addEventListener('click', () => {
            this.addLoadingPanel();
            this.startLoading();
        });
    }

    addLoadingPanel() {
        this.menu.classList.add('hide');
        this.loading = document.createElement('div');
        this.loading.classList.add('loading');
        this.menuScreen.appendChild(this.loading);
    }

    startLoading() {
        let percent = UI_OPTIONS.loadingStartNumber;
        this.game=new GameProcess(this.canvas);
        this.game.init();

        let id = setInterval(() => {
            if(percent === UI_OPTIONS.loadingFinishNumber) {
                this.canvas.classList.add('hide-cursor');
                this.clearMenu();
                this.scoreBlock.classList.remove('hide');

                this.game.startIntro();
                this.setPauseListeners();
                clearInterval(id);
            }
            this.loading.innerText = `${percent}`+'%';
            percent += UI_OPTIONS.loadingInterval;
        }, 250);
        this.loading.innerText = `${percent}`+'%';
    }

    clearMenu() {
        this.menuScreen.removeChild(this.loading);
        this.menuScreen.classList.add('hide');
        this.menuSound.pause();

        this.menu.removeChild(this.playButton);
        this.menu.removeChild(this.historyButton);
        this.menu.removeChild(this.aboutButton);
    }

    setPauseListeners() {
        this.createPauseMenuElements();
        this.createPauseMenu();

        this.resumeButton.addEventListener('click', () => {
            this.game.pause(this.menuScreen);
        });

        this.restartButton.addEventListener('click', () => {
            this.canvas.classList.remove('hide');
            this.menuScreen.classList.add('hide');

            if (this.menu.lastChild===this.aboutButton) {
                this.menu.removeChild(this.aboutButton);
                this.menu.insertBefore(this.resumeButton, this.restartButton);
            }

            this.game.restart();
        });

        this.menuButton.addEventListener('click', () => {
            document.location.href='./index.html';
        });

        document.addEventListener('keydown', (event) => {
            if (event.keyCode===UI_OPTIONS.pauseKey && !this.game.finish && this.game.inGame) {
                this.game.pause(this.menuScreen);
            }

        });

        document.addEventListener('isfinish', () => {
                this.createFinishMenu();
                this.game.pause(this.menuScreen);
        });
    }

    createPauseMenuElements() {
        this.menu.classList.remove('hide');

        this.restartButton=document.createElement('div');
        this.restartButton.classList.add('button');

        const restartTitle=document.createElement('h3');
        restartTitle.innerText='restart';
        this.restartButton.appendChild(restartTitle);
        //--------------------------------------------------------------------
        this.resumeButton=document.createElement('div');
        this.resumeButton.classList.add('button');

        const resumeTitle=document.createElement('h3');
        resumeTitle.innerText='resume';
        this.resumeButton.appendChild(resumeTitle);
        //--------------------------------------------------------------------
        this.menuButton=document.createElement('div');
        this.menuButton.classList.add('button');

        const menuTitle=document.createElement('h3');
        menuTitle.innerText='menu';
        this.menuButton.appendChild(menuTitle);
    }

    createPauseMenu() {
        const fragment = document.createDocumentFragment();

        fragment.appendChild(this.resumeButton);
        fragment.appendChild(this.restartButton);
        fragment.appendChild(this.menuButton);

        this.menu.appendChild(fragment);
    }

    createFinishMenu() {
        this.menu.removeChild(this.resumeButton);
        this.menu.appendChild(this.aboutButton);
    }
}

new XWingTransporterGame();
