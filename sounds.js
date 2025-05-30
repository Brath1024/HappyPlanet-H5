// 音效管理系统
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.5;
    this.initSounds();
  }

  // 初始化音效
  initSounds() {
    // 使用Web Audio API生成音效
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 预定义音效
    this.soundConfigs = {
      click: { frequency: 800, duration: 0.1, type: 'sine' },
      hit: { frequency: 600, duration: 0.15, type: 'square' },
      collision: { frequency: 400, duration: 0.2, type: 'sawtooth' },
      button: { frequency: 1000, duration: 0.08, type: 'sine' },
      upgrade: { frequency: 1200, duration: 0.3, type: 'triangle' },
      unlock: { frequency: 1500, duration: 0.4, type: 'sine' },
      spawn: { frequency: 500, duration: 0.25, type: 'triangle' },
      death: { frequency: 200, duration: 0.5, type: 'sawtooth' },
      levelUp: { frequency: 2000, duration: 0.6, type: 'sine' },
      collect: { frequency: 1800, duration: 0.35, type: 'triangle' }
    };
  }

  // 生成音效
  generateSound(config) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
    oscillator.type = config.type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + config.duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + config.duration);
  }

  // 播放音效
  play(soundName) {
    if (!this.enabled) return;
    
    const config = this.soundConfigs[soundName];
    if (config) {
      this.generateSound(config);
    }
  }

  // 播放复合音效（多个频率）
  playComplex(soundName, frequencies) {
    if (!this.enabled) return;
    
    const config = this.soundConfigs[soundName];
    if (config) {
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.generateSound({...config, frequency: freq});
        }, index * 50);
      });
    }
  }

  // 设置音量
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // 切换音效开关
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // 特殊音效
  playUpgradeSuccess() {
    this.playComplex('upgrade', [800, 1000, 1200, 1500]);
  }

  playLevelComplete() {
    this.playComplex('levelUp', [1000, 1200, 1500, 2000, 2500]);
  }

  playCollision() {
    this.play('collision');
  }

  playButtonClick() {
    this.play('button');
  }

  playBallHit() {
    this.play('hit');
  }

  playBallClick() {
    this.play('click');
  }

  playBallSpawn() {
    this.play('spawn');
  }

  playBallDeath() {
    this.play('death');
  }

  playCollectReward() {
    this.playComplex('collect', [1200, 1500, 1800]);
  }

  playUnlock() {
    this.playComplex('unlock', [800, 1200, 1600, 2000]);
  }
}

// 全局音效管理器
window.soundManager = new SoundManager(); 