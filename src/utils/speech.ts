export class SpeechService {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  
  constructor() {
    this.synth = window.speechSynthesis;
    this.initializeVoice();
  }
  
  private initializeVoice() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      const japaneseVoice = voices.find(voice => voice.lang.startsWith('ja'));
      this.voice = japaneseVoice || voices[0];
    };
    
    if (this.synth.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synth.addEventListener('voiceschanged', loadVoices);
    }
  }
  
  speak(text: string, rate: number = 0.9, pitch: number = 1.2) {
    if (!this.synth) return;
    
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 0.8;
    
    this.synth.speak(utterance);
  }
  
  speakNumber(number: number) {
    const text = number.toString();
    this.speak(text);
  }
  
  speakProblem(num1: number, num2: number) {
    const text = `${num1} たす ${num2} は？`;
    this.speak(text);
  }
  
  speakCorrect() {
    const phrases = ['すごい！', 'せいかい！', 'やったね！', 'てんさい！', 'パーフェクト！'];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.speak(phrase, 1.0, 1.3);
  }
  
  speakIncorrect() {
    const phrases = ['もういちど！', 'ちがうよ！', 'がんばって！'];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.speak(phrase, 0.9, 1.1);
  }
  
  stop() {
    this.synth.cancel();
  }
}

export const speechService = new SpeechService();