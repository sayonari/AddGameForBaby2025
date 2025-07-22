import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag } from 'lucide-react';
import type { Player, Item } from '../types/game';
import { soundService } from '../utils/sound';

interface ShopScreenProps {
  player: Player;
  onBuyItem: (itemId: string) => void;
  onGoHome: () => void;
}

const shopItems: Item[] = [
  {
    id: 'timeBonus5',
    name: 'じかん +5びょう',
    description: 'タイムアタックで5びょうふえる',
    icon: '⏱️',
    cost: 50,
    effect: { type: 'timeBonus', value: 5 },
    owned: false,
    active: false,
  },
  {
    id: 'timeBonus10',
    name: 'じかん +10びょう',
    description: 'タイムアタックで10びょうふえる',
    icon: '⏱️',
    cost: 100,
    effect: { type: 'timeBonus', value: 10 },
    owned: false,
    active: false,
  },
  {
    id: 'scoreX2',
    name: 'スコア 2ばい',
    description: 'もらえるスコアが2ばいになる',
    icon: '⭐',
    cost: 150,
    effect: { type: 'scoreMultiplier', value: 2 },
    owned: false,
    active: false,
  },
  {
    id: 'scoreX3',
    name: 'スコア 3ばい',
    description: 'もらえるスコアが3ばいになる',
    icon: '🌟',
    cost: 300,
    effect: { type: 'scoreMultiplier', value: 3 },
    owned: false,
    active: false,
  },
  {
    id: 'hint',
    name: 'ヒント きのう',
    description: 'こたえのヒントがみえる',
    icon: '💡',
    cost: 200,
    effect: { type: 'hintUnlock', value: 1 },
    owned: false,
    active: false,
  },
  {
    id: 'shield',
    name: 'まちがいガード',
    description: '1かいまちがえてもだいじょうぶ',
    icon: '🛡️',
    cost: 250,
    effect: { type: 'mistakeProtection', value: 1 },
    owned: false,
    active: false,
  },
];

export const ShopScreen: React.FC<ShopScreenProps> = ({ player, onBuyItem, onGoHome }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleBuyItem = (item: Item) => {
    if (player.coins >= item.cost && !player.items.some(i => i.id === item.id)) {
      soundService.playSound('correct');
      onBuyItem(item.id);
      setSelectedItem(null);
    } else {
      soundService.playSound('incorrect');
    }
  };

  const getItemStatus = (item: Item) => {
    const owned = player.items.some(i => i.id === item.id);
    const canAfford = player.coins >= item.cost;
    return { owned, canAfford };
  };

  return (
    <div className="shop-screen">
      <div className="shop-header">
        <button className="home-button" onClick={onGoHome}>
          <Home size={30} />
        </button>
        
        <h1>
          <ShoppingBag size={40} />
          おみせ
        </h1>
        
        <div className="coin-display">
          <span className="coin-icon">🪙</span>
          <span className="coin-amount">{player.coins}</span>
        </div>
      </div>

      <div className="shop-content">
        <div className="items-grid">
          {shopItems.map((item, index) => {
            const { owned, canAfford } = getItemStatus(item);
            
            return (
              <motion.div
                key={item.id}
                className={`shop-item ${owned ? 'owned' : ''} ${!canAfford && !owned ? 'locked' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!owned && canAfford ? { scale: 1.05 } : {}}
                whileTap={!owned && canAfford ? { scale: 0.95 } : {}}
                onClick={() => !owned && canAfford && setSelectedItem(item.id)}
              >
                <div className="item-icon">{item.icon}</div>
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                
                {owned ? (
                  <div className="item-status owned-status">
                    <Check size={20} />
                    もってる！
                  </div>
                ) : (
                  <div className="item-status price-status">
                    <span className="coin-icon">🪙</span>
                    <span className={canAfford ? 'affordable' : 'expensive'}>{item.cost}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {selectedItem && (
          <motion.div
            className="purchase-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const item = shopItems.find(i => i.id === selectedItem)!;
                return (
                  <>
                    <h2>かいますか？</h2>
                    <div className="item-preview">
                      <div className="item-icon">{item.icon}</div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="price">
                        <span className="coin-icon">🪙</span>
                        <span>{item.cost}</span>
                      </div>
                    </div>
                    <div className="modal-buttons">
                      <button
                        className="buy-button"
                        onClick={() => handleBuyItem(item)}
                      >
                        かう！
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => setSelectedItem(null)}
                      >
                        やめる
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Lucide ReactにCheckアイコンがないため、簡易的に実装
const Check: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);