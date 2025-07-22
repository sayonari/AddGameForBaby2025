export class VoiceRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  
  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'ja-JP';
      this.recognition.continuous = true; // 継続的に認識
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3; // より多くの候補を取得
    }
  }
  
  isSupported(): boolean {
    return !!this.recognition;
  }
  
  startListening(onResult: (text: string) => void, onEnd?: () => void): void {
    if (!this.recognition || this.isListening) return;
    
    this.isListening = true;
    
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      
      // 日本語の数字を英数字に変換（優先度順）
      const numberMap: { [key: string]: string } = {
        // 0
        'ゼロ': '0', 'ぜろ': '0', 'れい': '0', 'レイ': '0', 'れー': '0',
        // 1
        'いち': '1', 'イチ': '1', '一': '1', 'いっ': '1',
        // 2 - 様々なパターンを追加
        'に': '2', 'ニ': '2', '二': '2', 'にー': '2', 'にい': '2', 
        'ふたつ': '2', 'ふた': '2',
        // 3
        'さん': '3', 'サン': '3', '三': '3', 'さー': '3', 'みっつ': '3', 'みつ': '3',
        // 4
        'よん': '4', 'ヨン': '4', 'し': '4', 'シ': '4', '四': '4', 'よー': '4', 'よっつ': '4',
        // 5
        'ご': '5', 'ゴ': '5', '五': '5', 'ごー': '5', 'いつつ': '5',
        // 6
        'ろく': '6', 'ロク': '6', '六': '6', 'ろっ': '6', 'むっつ': '6', 'むつ': '6',
        // 7
        'なな': '7', 'ナナ': '7', 'しち': '7', 'シチ': '7', '七': '7', 'ななつ': '7',
        // 8
        'はち': '8', 'ハチ': '8', '八': '8', 'はっ': '8', 'やっつ': '8', 'やつ': '8',
        // 9
        'きゅう': '9', 'キュウ': '9', 'く': '9', 'ク': '9', '九': '9', 'きゅー': '9', 'ここのつ': '9',
        // 10-19
        'じゅう': '10', 'ジュウ': '10', '十': '10', 'じゅー': '10', 'とお': '10',
        'じゅういち': '11', 'じゅーいち': '11',
        'じゅうに': '12', 'じゅーに': '12', 'じゅうにー': '12',
        'じゅうさん': '13', 'じゅーさん': '13',
        'じゅうよん': '14', 'じゅうし': '14', 'じゅーよん': '14',
        'じゅうご': '15', 'じゅーご': '15',
        'じゅうろく': '16', 'じゅーろく': '16',
        'じゅうなな': '17', 'じゅうしち': '17', 'じゅーなな': '17',
        'じゅうはち': '18', 'じゅーはち': '18',
        'じゅうきゅう': '19', 'じゅうく': '19', 'じゅーきゅー': '19',
        // 20, 30
        'にじゅう': '20', 'にじゅー': '20',
        'さんじゅう': '30', 'さんじゅー': '30',
      };
      
      // デバッグ用ログ
      console.log('音声認識結果:', transcript);
      
      // 数字の読み方をすべて試す
      let convertedText = transcript.toLowerCase(); // 小文字に統一
      
      // スペースや句読点を削除
      convertedText = convertedText.replace(/[\s、。]/g, '');
      
      // 特殊なケース: 単独の「に」を優先的に処理
      if (convertedText === 'に' || convertedText === 'にー' || convertedText === 'にい') {
        onResult('2');
        return;
      }
      
      // より長い文字列から優先的に変換（例: 「じゅうに」を「じゅう」「に」より優先）
      const sortedKeys = Object.keys(numberMap).sort((a, b) => b.length - a.length);
      
      sortedKeys.forEach(key => {
        const regex = new RegExp(key, 'g');
        convertedText = convertedText.replace(regex, numberMap[key]);
      });
      
      // 数字だけを抽出
      const numbers = convertedText.match(/\d+/g);
      
      if (numbers && numbers.length > 0) {
        console.log('変換結果:', numbers[0]);
        onResult(numbers[0]);
      } else {
        // 英数字がそのまま含まれている場合
        const directNumbers = transcript.match(/\d+/g);
        if (directNumbers && directNumbers.length > 0) {
          onResult(directNumbers[0]);
        } else {
          console.log('数字を認識できませんでした:', transcript);
        }
      }
      
      if (result.isFinal) {
        this.stopListening();
      }
    };
    
    this.recognition.onerror = (event: any) => {
      console.error('音声認識エラー:', event.error);
      this.stopListening();
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };
    
    this.recognition.start();
  }
  
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  getListeningState(): boolean {
    return this.isListening;
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();