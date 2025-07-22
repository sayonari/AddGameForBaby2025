export const createIcon = (size: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // 数字
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.3}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('1+2', size / 2, size / 2 - size * 0.1);
  
  // 答え
  ctx.font = `bold ${size * 0.2}px Arial`;
  ctx.fillText('=3', size / 2, size / 2 + size * 0.15);
  
  // 星
  ctx.fillStyle = '#FFD700';
  ctx.font = `${size * 0.15}px Arial`;
  ctx.fillText('⭐', size * 0.2, size * 0.2);
  ctx.fillText('⭐', size * 0.8, size * 0.2);
  ctx.fillText('⭐', size * 0.2, size * 0.8);
  ctx.fillText('⭐', size * 0.8, size * 0.8);
  
  return canvas.toDataURL('image/png');
};

export const generateIcons = () => {
  const icon192 = createIcon(192);
  const icon512 = createIcon(512);
  
  // ダウンロード用のリンクを作成
  const link192 = document.createElement('a');
  link192.download = 'icon-192.png';
  link192.href = icon192;
  
  const link512 = document.createElement('a');
  link512.download = 'icon-512.png';
  link512.href = icon512;
  
  // Blobとして保存する場合
  return { icon192, icon512 };
};