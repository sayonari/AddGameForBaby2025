export class SoundService {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private bgmGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private isPlaying: boolean = false;
  private isInitialized: boolean = false;
  
  constructor() {
    // AudioContextの初期化を遅延させる
  }
  
  private initAudioContext() {
    if (this.audioContext) return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.bgmGainNode = this.audioContext.createGain();
    this.sfxGainNode = this.audioContext.createGain();
    this.bgmGainNode.connect(this.audioContext.destination);
    this.sfxGainNode.connect(this.audioContext.destination);
    this.bgmGainNode.gain.value = 0.2;
    this.sfxGainNode.gain.value = 0.5;
  }
  
  async init() {
    if (this.isInitialized) return;
    
    // AudioContextを初期化
    this.initAudioContext();
    
    // ユーザー操作後にAudioContextを再開
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.log('AudioContext resume failed:', e);
      }
    }
    
    // 効果音を生成
    await this.generateSounds();
    // BGMを生成
    this.createBGM();
    this.createOpeningBGM();
    
    this.isInitialized = true;
  }
  
  private async generateSounds() {
    // クリック音
    this.sounds.set('click', this.createClickSound());
    // 正解音
    this.sounds.set('correct', this.createCorrectSound());
    // 不正解音
    this.sounds.set('incorrect', this.createIncorrectSound());
    // 完了音
    this.sounds.set('complete', this.createCompleteSound());
  }
  
  private createClickSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin(2 * Math.PI * 1000 * i / this.audioContext.sampleRate) * Math.exp(-i / data.length * 5);
    }
    
    return buffer;
  }
  
  private createCorrectSound(): AudioBuffer {
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G
    
    for (let i = 0; i < data.length; i++) {
      let sample = 0;
      frequencies.forEach((freq, index) => {
        const startTime = index * data.length / frequencies.length;
        if (i >= startTime) {
          sample += Math.sin(2 * Math.PI * freq * (i - startTime) / this.audioContext.sampleRate) * 0.3;
        }
      });
      data[i] = sample * Math.exp(-i / data.length * 2);
    }
    
    return buffer;
  }
  
  private createIncorrectSound(): AudioBuffer {
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.2, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin(2 * Math.PI * 200 * i / this.audioContext.sampleRate) * 
                Math.sin(2 * Math.PI * 5 * i / this.audioContext.sampleRate) * 
                Math.exp(-i / data.length * 3);
    }
    
    return buffer;
  }
  
  private createCompleteSound(): AudioBuffer {
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.5, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
    
    for (let i = 0; i < data.length; i++) {
      let sample = 0;
      frequencies.forEach((freq, index) => {
        const startTime = index * data.length / frequencies.length / 2;
        if (i >= startTime) {
          sample += Math.sin(2 * Math.PI * freq * (i - startTime) / this.audioContext.sampleRate) * 0.25;
        }
      });
      data[i] = sample * Math.exp(-i / data.length * 1.5);
    }
    
    return buffer;
  }
  
  playSound(soundName: string) {
    const buffer = this.sounds.get(soundName);
    if (!buffer) return;
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.sfxGainNode);
    source.start();
  }
  
  private createBGM() {
    // 明るく楽しい子供向けBGMを生成（メジャースケール）
    const duration = 8; // 8秒のループ
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate);
    
    // C Major Scale (ハ長調) - 明るく楽しい響き
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C4-C5
    
    // コード進行: C-F-G-C (I-IV-V-I) - 最も基本的で明るい進行
    const chords = {
      C: [261.63, 329.63, 392.00], // C Major (C-E-G)
      F: [349.23, 440.00, 523.25], // F Major (F-A-C)
      G: [392.00, 493.88, 587.33], // G Major (G-B-D)
    };
    
    const tempo = 140; // より速いテンポでエネルギッシュに
    const beatDuration = 60 / tempo;
    
    // メロディーパターン（跳ねるようなリズム）
    const melodyPattern = [0, 2, 4, 5, 7, 5, 4, 2]; // スケール上のインデックス
    const rhythmPattern = [1, 0.5, 0.5, 1, 0.5, 0.5, 1, 1]; // リズムの長さ
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < data.length; i++) {
        const time = i / sampleRate;
        let sample = 0;
        
        // メロディー（明るく跳ねるような）
        const measureTime = time % 4; // 4拍子
        let currentBeat = 0;
        let noteIndex = 0;
        
        for (let j = 0; j < melodyPattern.length; j++) {
          if (measureTime >= currentBeat && measureTime < currentBeat + rhythmPattern[j] * beatDuration) {
            noteIndex = j;
            break;
          }
          currentBeat += rhythmPattern[j] * beatDuration;
        }
        
        const melodyFreq = scale[melodyPattern[noteIndex]];
        const noteTime = (measureTime - currentBeat) / (rhythmPattern[noteIndex] * beatDuration);
        const envelope = Math.sin(Math.PI * noteTime) * (1 - noteTime * 0.3); // スタッカート風
        sample += Math.sin(2 * Math.PI * melodyFreq * time) * 0.2 * envelope;
        
        // 高音の装飾音（キラキラ感）
        if (Math.floor(time * 8) % 16 === 0) {
          const sparkleFreq = scale[7] * 2; // 高いC
          sample += Math.sin(2 * Math.PI * sparkleFreq * time) * 0.1 * 
                   Math.exp(-(time % 0.125) * 20);
        }
        
        // コード伴奏（明るいアルペジオ）- リズムを整列
        const chordProgression = ['C', 'F', 'G', 'C'];
        const chordIndex = Math.floor(time / 2) % 4;
        const currentChord = chords[chordProgression[chordIndex] as keyof typeof chords];
        // 16分音符で均等にアルペジオ
        const sixteenthNote = beatDuration / 4;
        const arpeggioTime = time % (beatDuration * 2);
        const arpeggioIndex = Math.floor(arpeggioTime / sixteenthNote) % 3;
        const chordFreq = currentChord[arpeggioIndex];
        sample += Math.sin(2 * Math.PI * chordFreq * time) * 0.15;
        
        // ベースライン（ルート音を強調）
        const bassFreq = currentChord[0] / 2; // オクターブ下
        sample += Math.sin(2 * Math.PI * bassFreq * time) * 0.12;
        
        // パーカッション（軽快なリズム）
        const kickPattern = time % beatDuration < 0.05;
        const snarePattern = (time + beatDuration * 2) % (beatDuration * 4) < 0.05;
        
        if (kickPattern) {
          sample += Math.sin(2 * Math.PI * 60 * time) * 0.3 * 
                   Math.exp(-(time % beatDuration) * 30);
        }
        
        if (snarePattern) {
          sample += (Math.random() - 0.5) * 0.2 * 
                   Math.exp(-(time % beatDuration) * 40);
        }
        
        // ステレオ効果（左右に広がり）
        if (channel === 1) {
          sample *= 0.9;
          // ディレイ効果で広がりを出す
          const delayTime = 0.02;
          const delayIndex = Math.floor((time - delayTime) * sampleRate);
          if (delayIndex >= 0 && delayIndex < i) {
            sample += buffer.getChannelData(0)[delayIndex] * 0.3;
          }
        }
        
        data[i] = sample * 0.8; // 全体の音量調整
      }
    }
    
    this.sounds.set('bgm', buffer);
  }
  
  private createOpeningBGM() {
    // 明るくワクワクするオープニングBGM
    const duration = 12; // 12秒のループ
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate);
    
    // ペンタトニックスケール（5音階）- より親しみやすく明るい
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C-D-E-G-A-C
    
    // 明るいコード進行: C-Am-F-G (I-vi-IV-V)
    const chords = {
      C: [261.63, 329.63, 392.00, 523.25], // C Major
      Am: [220.00, 261.63, 329.63, 440.00], // A minor (明るさの中に少し変化)
      F: [174.61, 261.63, 349.23, 440.00], // F Major
      G: [196.00, 293.66, 392.00, 493.88], // G Major
    };
    
    const tempo = 120; // 適度なテンポ
    const beatDuration = 60 / tempo;
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < data.length; i++) {
        const time = i / sampleRate;
        let sample = 0;
        
        // ファンファーレ風のメロディー（オープニング感）
        const measureTime = time % 4;
        const phraseTime = time % 8;
        
        // イントロフレーズ（上昇する音階）
        if (phraseTime < 2) {
          const noteIndex = Math.floor(phraseTime * 3) % pentatonic.length;
          const melodyFreq = pentatonic[noteIndex];
          const envelope = 0.3 * (1 - Math.exp(-phraseTime * 5)) * Math.exp(-phraseTime * 0.5);
          sample += Math.sin(2 * Math.PI * melodyFreq * time) * envelope;
          
          // オクターブ上の装飾
          sample += Math.sin(2 * Math.PI * melodyFreq * 2 * time) * envelope * 0.3;
        }
        
        // メインメロディー（キャッチーなフレーズ）
        else {
          const melodyNotes = [4, 3, 2, 3, 4, 4, 4, 2, 3, 3, 3, 1, 2, 2, 2]; // インデックス
          const noteIndex = Math.floor((phraseTime - 2) * 4) % melodyNotes.length;
          const melodyFreq = pentatonic[melodyNotes[noteIndex] % pentatonic.length];
          const noteTime = (phraseTime - 2) % 0.25;
          const envelope = 0.25 * Math.sin(Math.PI * noteTime / 0.25);
          sample += Math.sin(2 * Math.PI * melodyFreq * time) * envelope;
        }
        
        // コード伴奏（ストリングス風）
        const chordProgression = ['C', 'Am', 'F', 'G'];
        const chordIndex = Math.floor(time / 3) % 4;
        const currentChord = chords[chordProgression[chordIndex] as keyof typeof chords];
        
        currentChord.forEach((freq, index) => {
          // ゆったりとした和音
          const chordEnvelope = 0.08 * (1 + 0.3 * Math.sin(2 * Math.PI * 0.5 * time));
          sample += Math.sin(2 * Math.PI * freq * time) * chordEnvelope;
        });
        
        // グロッケンシュピール風の装飾音（キラキラ感）
        if (Math.floor(time * 2) % 8 === 0) {
          const glockFreq = pentatonic[5] * 2; // 高いC
          const glockEnv = Math.exp(-(time % 0.5) * 10);
          sample += Math.sin(2 * Math.PI * glockFreq * time) * 0.15 * glockEnv;
          // 倍音を追加してよりベル的な音に
          sample += Math.sin(2 * Math.PI * glockFreq * 3 * time) * 0.05 * glockEnv;
        }
        
        // ティンパニ風のアクセント（ドラムロール的な盛り上がり）
        if (phraseTime < 0.5 && Math.floor(time * 32) % 2 === 0) {
          const timpaniFreq = 82.41; // Low E
          sample += Math.sin(2 * Math.PI * timpaniFreq * time) * 0.2 * 
                   Math.exp(-(phraseTime) * 10);
        }
        
        // ステレオ効果（広がりのあるサウンド）
        if (channel === 1) {
          sample *= 0.85;
          // コーラス効果
          const chorusDelay = 0.015 + 0.005 * Math.sin(2 * Math.PI * 0.7 * time);
          const delayIndex = Math.floor((time - chorusDelay) * sampleRate);
          if (delayIndex >= 0 && delayIndex < i) {
            sample += buffer.getChannelData(0)[delayIndex] * 0.4;
          }
        }
        
        data[i] = sample * 0.7; // 全体の音量調整
      }
    }
    
    this.sounds.set('openingBGM', buffer);
  }
  
  playBGM(bgmType: string = 'bgm') {
    if (this.isPlaying) {
      this.stopBGM();
    }
    
    const buffer = this.sounds.get(bgmType);
    if (!buffer) return;
    
    this.bgmSource = this.audioContext.createBufferSource();
    this.bgmSource.buffer = buffer;
    this.bgmSource.loop = true;
    this.bgmSource.connect(this.bgmGainNode);
    this.bgmSource.start();
    this.isPlaying = true;
  }
  
  stopBGM() {
    if (this.bgmSource && this.isPlaying) {
      this.bgmSource.stop();
      this.bgmSource = null;
      this.isPlaying = false;
    }
  }
  
  setBgmVolume(volume: number) {
    this.bgmGainNode.gain.value = Math.max(0, Math.min(1, volume));
  }
  
  setSfxVolume(volume: number) {
    this.sfxGainNode.gain.value = Math.max(0, Math.min(1, volume));
  }
  
  setMuted(muted: boolean) {
    if (muted) {
      this.bgmGainNode.gain.value = 0;
      this.sfxGainNode.gain.value = 0;
    } else {
      this.bgmGainNode.gain.value = 0.2;
      this.sfxGainNode.gain.value = 0.5;
    }
  }
}

export const soundService = new SoundService();