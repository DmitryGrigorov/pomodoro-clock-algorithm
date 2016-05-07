window.onload = function (){
  
    var Pomodoro = function(pomodoroTime, breakTime, displayElementId, messageDisplayId){
        this.cycle = pomodoroTime * 60; // основное время
        this.break = breakTime * 60; // время отдыха
        this.state = 0; // начальное состояние
        this.lastState = 2; // это дополнительное состояние будет использоваться когда мы захотим поставить таймер на паузу а затем воспроизвести с того же самого места на котором остановились
        this.timeLeft = pomodoroTime * 60; // тоже самое время, но отличается тем, что именно его мы будем использовать за основное
        this.timerDisplay = displayElementId; // ID таймера
        this.messageDisplay = messageDisplayId; // ID сообщения
    }
    
    Pomodoro.prototype.start = function () {                //начало метода
        var self = this;                                    // мы создаем переменную self которая будет ссылаться на объект this.Почему? А потому, что если мы вызовим внутри функции tick() объект this он будет ссылаться на саму функцию 
        
        if(this.state === 0 || this.state === 1) {
            this.newState(this.lastState === 2 ? 2 : 3); // если таймер остановился или на паузе
            
            tick(); // функция запускается здесь для того что обновить состояние или поменять цвет таймера
            
            this.timer = setInterval(function(){
                tick();
            }, 1000); // вызываем функцию tick каждую секунду
            
        }
        
        
        function tick(){
            self.timeLeft = self.timeLeft - 1; // уменьшение цикла на единицу
            self.updateDisplay(self.timeLeft); // обновляем дисплей
            
            if(self.timeLeft === 0){ // если функция достигает нуля то мы начинаем break cycle или же pomodoro cycle
                self.timeLeft = self.state === 2 ? self.break : self.cycle; // мы обновляем свойства каждый следующий цикл
                self.newState(self.state === 2 ? 3 : 2); // Мы меняем состояние для следующего цикла
            }
            
        } 
        
    }
    
    Pomodoro.prototype.pause = function () {
      if(this.state === 2 || this.state === 3){ // удостоверяемся, что что таймер запущен или то, что уже не нажата пауза
          this.newState(1); // устанавлием паузу текущим состоянием
          clearInterval(this.timer); // очищает интервалы которые мы создали ранее
      }     
    };
    
    Pomodoro.prototype.reset = function () {
        this.newState(0); // устанавливает на начальное
        this.timeLeft = this.cycle;
        clearInterval(this.timer);
        this.updateDisplay(this.timeLeft);
    }
    
    Pomodoro.prototype.updateDisplay = function (time, message) {
        document.getElementById(this.timerDisplay).innerText = getFormattedTime(time);
        if(message){
            document.getElementById(this.messageDisplay).innerText = message;
        }
        
        function getFormattedTime(seconds){
            
            var hoursLeft = Math.floor (seconds / 3600);
                minsLeft = Math.floor( (seconds - (hoursLeft * 3600) ) / 60),
                secondsLeft = seconds - (minsLeft * 60) - (hoursLeft * 3600);
            
            return zeroPad(hoursLeft) + ':' + zeroPad(minsLeft) + ':' + zeroPad(secondsLeft);
            
            function zeroPad(number){
                return number < 10 ? '0' + number : number;    
            }
            
            
        }
        
    }
    
    Pomodoro.prototype.updateTimes = function (cycleTime, breakTime) {
        this.cycle = cycleTime * 60;
        this.break = breakTime * 60;
        this.reset();
    };
    
    Pomodoro.prototype.newState = function (state) {
        this.lastState = this.state;
        this.state = state;
        var message, audioFile;
        
        switch (state) {
            case 0:
                this.lastState = 2;
                console.info('New state set: Initial state.');
                message = 'Click on play to start!';
                document.getElementById('timer');
                break;
            case 1:
                console.info('New state set: Paused.');
                audioFile = 'http://oringz.com/oringz-uploads/sounds-882-solemn.mp3';
                message = 'Paused';
                document.getElementById('timer').style.color = '#CED073';
                break;
            case 2:
                console.info('New state set: Pomodoro cycle.');
                audioFile = 'http://oringz.com/oringz-uploads/sounds-766-graceful.mp3';
                message = 'WORK WORK!';
                document.getElementById('timer').style.color = '#C19AEA';
                break;
            case 3:
                console.info('New state set: Break cycle.');
                audioFile = 'http://oringz.com/oringz-uploads/31_oringz-pack-nine-15.mp3';
                message = 'Break time! Use your time wisely!';
                document.getElementById('timer').style.color = '#53C56C';
                break;
        };
        
        if(state === 1 || state === 2 || state === 3 ){
            var audio = new Audio(audioFile);
            audio.play();
        };
        
        this.updateDisplay(this.timeLeft, message);
    };
    
    var elPomodoroTime = document.getElementById('pomodoro-time'),
        elBreakTime = document.getElementById('break-time'),
        elPomUp = document.getElementById('pomodoro-time-up'),
        elPomDown = document.getElementById('pomodoro-time-down'),
        elBreakUp = document.getElementById('break-time-up'),
        elBreakDown = document.getElementById('break-time-down'),
        elStart = document.getElementById('start'),
        elPause = document.getElementById('pause'),
        elReset = document.getElementById('reset');
    
    var myPomodoro = new Pomodoro(25, 5, 'timer', 'message-display');
    
    elStart.addEventListener('click', function(){
        myPomodoro.start();
    });
    
    elPause.addEventListener('click', function(){
        myPomodoro.pause();
    });
    
    elReset.addEventListener('click', function () {
        myPomodoro.reset();
    });
    
    elPomUp.addEventListener('click', function (){
        elPomodoroTime.innerText = parseInt(elPomodoroTime.innerText) + 1;
        myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);
    });
    
    elPomDown.addEventListener('click', function () {
        elPomodoroTime.innerText = parseInt(elPomodoroTime.innerText) === 1 ? 1 : parseInt(elPomodoroTime.innerText) - 1;
        myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);
    });
    
    elBreakUp.addEventListener('click', function() {
        elBreakTime.innerText = parseInt(elBreakTime.innerText) + 1;
        myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);
    });
    
    elBreakDown.addEventListener('click', function() {
        elBreakTime.innerText = parseInt(elBreakTime.innerText) === 1 ? 1 : parseInt(elBreakTime.innerText) - 1;
        myPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);
    });
    
};