import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface CaseItem {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  price: number;
}

interface Case {
  id: string;
  name: string;
  image: string;
  price: number;
  items: CaseItem[];
}

interface LiveDrop {
  id: string;
  username: string;
  item: CaseItem;
  timestamp: Date;
}

const mockCases: Case[] = [
  {
    id: '1',
    name: 'Spectrum Case',
    image: '/img/27750852-342a-4084-93a9-0bd2e6869890.jpg',
    price: 250,
    items: []
  },
  {
    id: '2', 
    name: 'Danger Zone Case',
    image: '/img/27750852-342a-4084-93a9-0bd2e6869890.jpg',
    price: 120,
    items: []
  },
  {
    id: '3',
    name: 'Prisma Case',
    image: '/img/27750852-342a-4084-93a9-0bd2e6869890.jpg',
    price: 180,
    items: []
  }
];

const mockItems: CaseItem[] = [
  {
    id: '1',
    name: 'AK-47 | Redline',
    image: '/img/e61e62df-7552-441e-99ca-754703bc4aa8.jpg',
    rarity: 'legendary',
    price: 15.50
  },
  {
    id: '2',
    name: 'AWP | Dragon Lore',
    image: '/img/0b026351-d1f5-4e31-b833-ad937ec17be0.jpg',
    rarity: 'mythic',
    price: 2500.00
  },
  {
    id: '3',
    name: 'M4A4 | Howl',
    image: '/img/e61e62df-7552-441e-99ca-754703bc4aa8.jpg',
    rarity: 'legendary',
    price: 850.00
  }
];

const mockLiveDrops: LiveDrop[] = [
  { id: '1', username: 'Pro_Gamer_2024', item: mockItems[1], timestamp: new Date(Date.now() - 30000) },
  { id: '2', username: 'CaseHunter', item: mockItems[0], timestamp: new Date(Date.now() - 45000) },
  { id: '3', username: 'SkinCollector', item: mockItems[2], timestamp: new Date(Date.now() - 60000) }
];

export default function Index() {
  const [balance, setBalance] = useState(1250);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);
  const [liveDrops, setLiveDrops] = useState<LiveDrop[]>(mockLiveDrops);

  // Simulate live drops
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUser = `User${Math.floor(Math.random() * 9999)}`;
      const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];
      const newDrop: LiveDrop = {
        id: Date.now().toString(),
        username: randomUser,
        item: randomItem,
        timestamp: new Date()
      };
      
      setLiveDrops(prev => [newDrop, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const openCase = async (caseToOpen: Case) => {
    if (balance < caseToOpen.price) return;
    
    setSelectedCase(caseToOpen);
    setIsOpening(true);
    setBalance(prev => prev - caseToOpen.price);
    
    // Simulate case opening animation
    setTimeout(() => {
      const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];
      setWonItem(randomItem);
      setIsOpening(false);
      
      // Add to live drops
      const newDrop: LiveDrop = {
        id: Date.now().toString(),
        username: 'You',
        item: randomItem,
        timestamp: new Date()
      };
      setLiveDrops(prev => [newDrop, ...prev.slice(0, 9)]);
    }, 3000);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'rarity-common',
      uncommon: 'rarity-uncommon',
      rare: 'rarity-rare',
      epic: 'rarity-epic',
      legendary: 'rarity-legendary',
      mythic: 'rarity-mythic'
    };
    return colors[rarity as keyof typeof colors] || 'rarity-common';
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}с назад`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}м назад`;
    const hours = Math.floor(minutes / 60);
    return `${hours}ч назад`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-black neon-text">
                CASE<span className="text-primary">HUB</span>
              </h1>
              <nav className="hidden md:flex space-x-6">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Icon name="Home" size={16} className="mr-2" />
                  Главная
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Icon name="ShoppingBag" size={16} className="mr-2" />
                  Магазин
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Icon name="Swords" size={16} className="mr-2" />
                  Case Battle
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <Icon name="Package" size={16} className="mr-2" />
                  Инвентарь
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Card className="bg-card/80 border-primary/20">
                <CardContent className="p-3 flex items-center space-x-2">
                  <Icon name="Coins" size={20} className="text-primary" />
                  <span className="font-bold text-lg">{balance.toLocaleString()} CR</span>
                </CardContent>
              </Card>
              
              <Button className="neon-glow">
                <Icon name="Plus" size={16} className="mr-2" />
                Пополнить
              </Button>
              
              <Button variant="outline">
                <Icon name="User" size={16} className="mr-2" />
                Профиль
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl font-black mb-6 neon-text">
            ОТКРЫВАЙ<br />
            <span className="text-primary animate-neon-pulse">КЕЙСЫ CS:GO</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Получай редкие скины, участвуй в баттлах и становись легендой CaseHub!
          </p>
          <Button size="lg" className="neon-glow text-lg px-8 py-4">
            <Icon name="Play" size={24} className="mr-2" />
            Начать игру
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Drops */}
          <div className="lg:col-span-1">
            <Card className="bg-card/80 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Zap" className="text-primary animate-neon-pulse" />
                  <span>Live дропы</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {liveDrops.map((drop) => (
                  <div key={drop.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                    <img 
                      src={drop.item.image} 
                      alt={drop.item.name}
                      className={`w-12 h-12 rounded border-2 ${getRarityColor(drop.item.rarity)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{drop.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{drop.item.name}</p>
                      <p className="text-xs text-primary font-bold">${drop.item.price}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(drop.timestamp)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Case Opening Animation */}
            {(isOpening || wonItem) && (
              <Card className="mb-8 bg-card/90 border-primary/30">
                <CardContent className="p-8 text-center">
                  {isOpening ? (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold">Открываем {selectedCase?.name}...</h3>
                      <div className="relative">
                        <img 
                          src={selectedCase?.image} 
                          alt={selectedCase?.name}
                          className="w-32 h-32 mx-auto animate-case-shake neon-glow"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                        <p className="text-muted-foreground">Удача определяется...</p>
                      </div>
                    </div>
                  ) : wonItem && (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-primary neon-text">Поздравляем!</h3>
                      <div className="relative">
                        <img 
                          src={wonItem.image} 
                          alt={wonItem.name}
                          className={`w-40 h-40 mx-auto rounded-lg border-4 ${getRarityColor(wonItem.rarity)} neon-glow animate-scale-in`}
                        />
                        <Badge 
                          className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${wonItem.rarity === 'mythic' ? 'bg-yellow-500' : wonItem.rarity === 'legendary' ? 'bg-red-500' : 'bg-purple-500'}`}
                        >
                          {wonItem.rarity.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold mb-2">{wonItem.name}</h4>
                        <p className="text-3xl font-black text-primary">${wonItem.price}</p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={() => setWonItem(null)} className="neon-glow">
                          Открыть еще
                        </Button>
                        <Button variant="outline">
                          В инвентарь
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Top Cases */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">
                <Icon name="Crown" className="inline mr-2 text-primary" />
                Топ кейсов
              </h3>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockCases.map((caseItem) => (
                  <Card key={caseItem.id} className="bg-card/80 border-primary/20 hover:border-primary/50 transition-all hover:scale-105 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={caseItem.image} 
                          alt={caseItem.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                      
                      <h4 className="font-bold text-lg mb-2">{caseItem.name}</h4>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-primary">
                          {caseItem.price} CR
                        </span>
                        <Badge variant="secondary" className="pulse-glow">
                          Популярный
                        </Badge>
                      </div>
                      
                      <Button 
                        className="w-full neon-glow"
                        onClick={() => openCase(caseItem)}
                        disabled={balance < caseItem.price || isOpening}
                      >
                        {balance < caseItem.price ? 'Недостаточно CR' : 'Открыть кейс'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Battle Section Preview */}
            <Card className="mt-8 bg-gradient-to-r from-secondary/20 to-accent/20 border-secondary/30">
              <CardContent className="p-8 text-center">
                <Icon name="Swords" size={48} className="mx-auto mb-4 text-secondary" />
                <h3 className="text-2xl font-bold mb-2">Case Battle</h3>
                <p className="text-muted-foreground mb-6">
                  Сражайся с другими игроками в режиме реального времени!
                </p>
                <Button variant="secondary" size="lg" className="neon-glow">
                  <Icon name="Play" size={20} className="mr-2" />
                  Войти в битву
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary">CaseHub</h4>
              <p className="text-muted-foreground text-sm">
                Лучшая платформа для открытия кейсов CS:GO
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Игра</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Магазин кейсов</li>
                <li>Case Battle</li>
                <li>Инвентарь</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Поддержка</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>FAQ</li>
                <li>Связаться с нами</li>
                <li>Правила</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Следите за нами</h5>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="p-2">
                  <Icon name="MessageCircle" size={16} />
                </Button>
                <Button size="sm" variant="outline" className="p-2">
                  <Icon name="Users" size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CaseHub. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}