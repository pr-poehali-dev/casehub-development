import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    name: 'Spectrum 2 Case',
    image: '/img/27750852-342a-4084-93a9-0bd2e6869890.jpg',
    price: 250,
    items: []
  },
  {
    id: '2', 
    name: 'Dreams & Nightmares Case',
    image: '/img/27750852-342a-4084-93a9-0bd2e6869890.jpg',
    price: 120,
    items: []
  },
  {
    id: '3',
    name: 'Revolution Case',
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
    price: 1550
  },
  {
    id: '2',
    name: 'AWP | Dragon Lore',
    image: '/img/0b026351-d1f5-4e31-b833-ad937ec17be0.jpg',
    rarity: 'mythic',
    price: 250000
  },
  {
    id: '3',
    name: 'M4A4 | Howl',
    image: '/img/e61e62df-7552-441e-99ca-754703bc4aa8.jpg',
    rarity: 'legendary',
    price: 85000
  },
  {
    id: '4',
    name: 'Glock-18 | Water Elemental',
    image: '/img/e61e62df-7552-441e-99ca-754703bc4aa8.jpg',
    rarity: 'rare',
    price: 450
  },
  {
    id: '5',
    name: 'USP-S | Kill Confirmed',
    image: '/img/0b026351-d1f5-4e31-b833-ad937ec17be0.jpg',
    rarity: 'epic',
    price: 2800
  },
  {
    id: '6',
    name: 'P250 | See Ya Later',
    image: '/img/e61e62df-7552-441e-99ca-754703bc4aa8.jpg',
    rarity: 'uncommon',
    price: 120
  },
  {
    id: '7',
    name: 'Five-SeveN | Monkey Business',
    image: '/img/0b026351-d1f5-4e31-b833-ad937ec17be0.jpg',
    rarity: 'common',
    price: 80
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
  const [inventory, setInventory] = useState<CaseItem[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<CaseItem[]>([]);
  const [isRouletteSpinning, setIsRouletteSpinning] = useState(false);
  const rouletteRef = useRef<HTMLDivElement>(null);

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

  const generateRouletteItems = () => {
    const items = [];
    // Generate 50 items for smooth roulette effect
    for (let i = 0; i < 50; i++) {
      items.push(mockItems[Math.floor(Math.random() * mockItems.length)]);
    }
    return items;
  };

  const openCase = async (caseToOpen: Case) => {
    if (balance < caseToOpen.price || isOpening) return;
    
    setSelectedCase(caseToOpen);
    setIsOpening(true);
    setIsRouletteSpinning(true);
    setWonItem(null);
    setBalance(prev => prev - caseToOpen.price);
    
    // Generate roulette items
    const items = generateRouletteItems();
    setRouletteItems(items);
    
    // Choose winning item (will be at position ~30 for nice effect)
    const winningItem = mockItems[Math.floor(Math.random() * mockItems.length)];
    items[30] = winningItem;
    
    // Animate roulette
    setTimeout(() => {
      if (rouletteRef.current) {
        const itemWidth = 120; // Width of each item + gap
        const finalPosition = -(30 * itemWidth - 300); // Position to show winning item centered
        rouletteRef.current.style.transform = `translateX(${finalPosition}px)`;
        rouletteRef.current.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    }, 100);
    
    // Show result after animation
    setTimeout(() => {
      setIsRouletteSpinning(false);
      setWonItem(winningItem);
      setIsOpening(false);
      setInventory(prev => [...prev, winningItem]);
      
      // Add to live drops
      const newDrop: LiveDrop = {
        id: Date.now().toString(),
        username: 'You',
        item: winningItem,
        timestamp: new Date()
      };
      setLiveDrops(prev => [newDrop, ...prev.slice(0, 9)]);
    }, 3500);
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
                <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => setShowProfile(true)}>
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
              
              <Dialog open={showTopUp} onOpenChange={setShowTopUp}>
                <DialogTrigger asChild>
                  <Button className="neon-glow">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Пополнить
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-primary/30">
                  <DialogHeader>
                    <DialogTitle className="text-primary neon-text">Пополнение баланса</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[100, 500, 1000, 2500, 5000, 10000].map((amount) => (
                        <Button 
                          key={amount}
                          variant="outline" 
                          className="h-16 flex flex-col space-y-1 hover:border-primary/50"
                          onClick={() => {
                            setBalance(prev => prev + amount);
                            setShowTopUp(false);
                          }}
                        >
                          <span className="text-2xl font-bold text-primary">{amount}</span>
                          <span className="text-xs text-muted-foreground">CR</span>
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="custom-amount">Своя сумма</Label>
                      <div className="flex space-x-2">
                        <Input id="custom-amount" placeholder="Введите сумму" className="bg-muted/20" />
                        <Button className="neon-glow">Пополнить</Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showProfile} onOpenChange={setShowProfile}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Icon name="User" size={16} className="mr-2" />
                    Профиль
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-card border-primary/30">
                  <DialogHeader>
                    <DialogTitle className="text-primary neon-text">Профиль игрока</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="inventory" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
                      <TabsTrigger value="stats">Статистика</TabsTrigger>
                      <TabsTrigger value="settings">Настройки</TabsTrigger>
                    </TabsList>
                    <TabsContent value="inventory" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Предметы ({inventory.length})</h3>
                        <div className="text-sm text-muted-foreground">
                          Общая стоимость: <span className="text-primary font-bold">{inventory.reduce((sum, item) => sum + item.price, 0).toLocaleString()} CR</span>
                        </div>
                      </div>
                      {inventory.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Инвентарь пуст</p>
                          <p className="text-sm">Открывайте кейсы, чтобы получить предметы!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                          {inventory.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="group">
                              <div className={`relative aspect-square rounded-lg border-2 ${getRarityColor(item.rarity)} bg-muted/20 overflow-hidden hover:scale-105 transition-transform`}>
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-white text-xs font-medium truncate">{item.name}</p>
                                    <p className="text-primary text-xs font-bold">{item.price.toLocaleString()} CR</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="stats" className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <Card className="bg-muted/20">
                          <CardContent className="p-6">
                            <div className="text-center">
                              <Icon name="Package" size={32} className="mx-auto mb-2 text-primary" />
                              <p className="text-2xl font-bold">{inventory.length}</p>
                              <p className="text-sm text-muted-foreground">Предметов получено</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/20">
                          <CardContent className="p-6">
                            <div className="text-center">
                              <Icon name="Coins" size={32} className="mx-auto mb-2 text-primary" />
                              <p className="text-2xl font-bold">{inventory.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">CR получено</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/20">
                          <CardContent className="p-6">
                            <div className="text-center">
                              <Icon name="Trophy" size={32} className="mx-auto mb-2 text-secondary" />
                              <p className="text-2xl font-bold">{inventory.filter(item => item.rarity === 'mythic' || item.rarity === 'legendary').length}</p>
                              <p className="text-sm text-muted-foreground">Редких предметов</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/20">
                          <CardContent className="p-6">
                            <div className="text-center">
                              <Icon name="Target" size={32} className="mx-auto mb-2 text-accent" />
                              <p className="text-2xl font-bold">{inventory.length}</p>
                              <p className="text-sm text-muted-foreground">Кейсов открыто</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    <TabsContent value="settings" className="space-y-4">
                      <Card className="bg-muted/20">
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-4">Аккаунт</h4>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="username">Имя пользователя</Label>
                              <Input id="username" defaultValue="ProGamer2024" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" defaultValue="player@casehub.com" className="mt-1" />
                            </div>
                            <Button className="neon-glow">Сохранить</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl font-black mb-6 neon-text">
            ОТКРЫВАЙ<br />
            <span className="text-primary animate-neon-pulse">КЕЙСЫ CS2</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Получай редкие скины CS2, участвуй в баттлах и становись легендой CaseHub!
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
                      <p className="text-xs text-primary font-bold">{drop.item.price.toLocaleString()} CR</p>
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
            {(isOpening || isRouletteSpinning || wonItem) && (
              <Card className="mb-8 bg-card/90 border-primary/30">
                <CardContent className="p-8">
                  {(isOpening || isRouletteSpinning) ? (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-center">Открываем {selectedCase?.name}...</h3>
                      
                      {/* Roulette Container */}
                      <div className="relative bg-muted/20 rounded-lg p-4 overflow-hidden">
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary transform -translate-x-1/2 z-10 rounded-full shadow-lg neon-glow"></div>
                        
                        <div 
                          ref={rouletteRef}
                          className="flex space-x-4 py-4"
                          style={{ transform: 'translateX(0px)', transition: 'none' }}
                        >
                          {rouletteItems.map((item, index) => (
                            <div 
                              key={index}
                              className={`flex-shrink-0 w-28 h-28 rounded-lg border-2 ${getRarityColor(item.rarity)} bg-muted/40 flex flex-col items-center justify-center`}
                            >
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <p className="text-xs text-center mt-1 truncate w-full px-1">{item.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-full bg-muted rounded-full h-2 mb-2">
                          <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                        <p className="text-muted-foreground">Удача определяется...</p>
                      </div>
                    </div>
                  ) : wonItem && (
                    <div className="space-y-6 text-center">
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
                        <p className="text-3xl font-black text-primary">{wonItem.price.toLocaleString()} CR</p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={() => setWonItem(null)} className="neon-glow">
                          Открыть еще
                        </Button>
                        <Button variant="outline" onClick={() => setShowProfile(true)}>
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
                Лучшая платформа для открытия кейсов CS2
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