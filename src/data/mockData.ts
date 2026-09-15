import { Category, Product, RestaurantConfig, Order } from '../types';

export const initialConfig: RestaurantConfig = {
  name: 'Terraço Parrilla & Bistrô',
  slogan: 'Cortes nobres na brasa, massas artesanais & drinks autorais',
  address: 'Av. Paulista, 1842 - Jardins, São Paulo',
  phone: '(11) 98765-4321',
  wifiName: 'Terraco_Clientes',
  wifiPassword: 'fogoebrasa2026',
  serviceFeePercentage: 10,
  currencySymbol: 'R$',
  totalTables: 16,
};

export const initialCategories: Category[] = [
  { id: 'cat-entradas', name: 'Entradas & Petiscos', iconName: 'UtensilsCrossed', sortOrder: 1 },
  { id: 'cat-parrilla', name: 'Carnes & Parrilla', iconName: 'Flame', sortOrder: 2 },
  { id: 'cat-burgers', name: 'Burgers Artesanais', iconName: 'Sandwich', sortOrder: 3 },
  { id: 'cat-massas', name: 'Massas & Risotos', iconName: 'Soup', sortOrder: 4 },
  { id: 'cat-sobremesas', name: 'Sobremesas', iconName: 'IceCream', sortOrder: 5 },
  { id: 'cat-drinks', name: 'Bebidas & Drinks', iconName: 'Wine', sortOrder: 6 },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    categoryId: 'cat-entradas',
    name: 'Dadinhos de Tapioca com Geleia de Pimenta',
    description: 'Cubos crocantes de tapioca com queijo coalho artesanal da Canastra, servidos com redução caseira de pimenta dedo-de-moça levemente defumada.',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Mais Vendido',
    preparationTimeMinutes: 15,
    tags: ['vegetariano', 'sem-gluten', 'destaque'],
    complements: [
      { id: 'comp-1', name: 'Porção extra de geleia de pimenta', price: 6.00 },
      { id: 'comp-2', name: 'Dip de maionese de alho negro', price: 8.00 }
    ]
  },
  {
    id: 'prod-2',
    categoryId: 'cat-entradas',
    name: 'Carpaccio Clássico com Rúcula e Alcaparras',
    description: 'Lâminas ultrafinas de filé mignon curado, mostarda dijon, queijo grana padano ralado na hora, alcaparras crocantes e azeite trufado.',
    price: 49.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Sugestão do Chef',
    preparationTimeMinutes: 12,
    tags: ['sem-gluten'],
    complements: [
      { id: 'comp-3', name: 'Cesta de torradas artesanais com ervas', price: 9.00 }
    ]
  },
  {
    id: 'prod-3',
    categoryId: 'cat-entradas',
    name: 'Provoleta na Brasa ao Chimichurri',
    description: 'Roda grossa de provolone tostado na grelha até fundir o miolo, tomatinhos confitados, orégano fresco e chimichurri artesanal.',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTimeMinutes: 14,
    tags: ['vegetariano'],
    complements: [
      { id: 'comp-4', name: 'Pão de fermentação natural tostado', price: 8.50 }
    ]
  },
  {
    id: 'prod-4',
    categoryId: 'cat-parrilla',
    name: 'Bife de Chorizo Black Angus (350g)',
    description: 'Corte nobre da parrilla argentina com camada generosa de gordura caramelizada, sal grosso de Maldon. Acompanha farofa de bacon e batata rústica ao alecrim.',
    price: 94.00,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Destaque Parrilla',
    preparationTimeMinutes: 25,
    tags: ['sem-gluten', 'destaque'],
    complements: [
      { id: 'comp-5', name: 'Ponto da carne: Mal passado', price: 0.00 },
      { id: 'comp-6', name: 'Ponto da carne: Ao ponto', price: 0.00 },
      { id: 'comp-7', name: 'Ponto da carne: Bem passado', price: 0.00 },
      { id: 'comp-8', name: 'Molho gorgonzola cremoso', price: 12.00 },
      { id: 'comp-9', name: 'Porção extra de chimichurri', price: 6.00 }
    ]
  },
  {
    id: 'prod-5',
    categoryId: 'cat-parrilla',
    name: 'Prime Rib Angus Especial (650g)',
    description: 'Corte com osso imponente grelhado na brasa viva, manteiga trufada aromatizada derretida sobre o corte e legumes defumados na brasa.',
    price: 148.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Para Compartilhar',
    preparationTimeMinutes: 30,
    tags: ['sem-gluten'],
    complements: [
      { id: 'comp-10', name: 'Arroz biro-biro com ovo caipira e palha', price: 18.00 },
      { id: 'comp-11', name: 'Purê de batata baroa com queijo da Canastra', price: 16.00 }
    ]
  },
  {
    id: 'prod-6',
    categoryId: 'cat-parrilla',
    name: 'Galeto Desossado Grelhado com Ervas Finas',
    description: 'Meio galeto marinado no vinho branco com sálvia e alecrim, tostado com pele ultra crocante. Acompanha polenta cremosa e vinagrete.',
    price: 62.00,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTimeMinutes: 20,
    tags: ['sem-gluten']
  },
  {
    id: 'prod-7',
    categoryId: 'cat-burgers',
    name: 'Smash Trufado Terraço Burger',
    description: 'Duplo blend bovino angus 100g, queijo cheddar inglês fundido, maionese artesanal de trufas negras, cebola caramelizada e pão brioche amanteigado tostado.',
    price: 46.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Mais Vendido',
    preparationTimeMinutes: 18,
    tags: ['destaque'],
    complements: [
      { id: 'comp-12', name: 'Bacon fatiado defumado crocante', price: 7.00 },
      { id: 'comp-13', name: 'Batata frita palito rústica com páprica', price: 14.00 },
      { id: 'comp-14', name: 'Queijo cheddar extra', price: 5.00 }
    ]
  },
  {
    id: 'prod-8',
    categoryId: 'cat-burgers',
    name: 'Brie & Honey Smoked Burger',
    description: 'Blend alto 180g de costela bovina, queijo brie maçaricado, bacon artesanal em tiras crocantes, geleia suave de pimenta com mel e rúcula.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTimeMinutes: 20,
    complements: [
      { id: 'comp-15', name: 'Batata frita trufada com parmesão', price: 18.00 }
    ]
  },
  {
    id: 'prod-9',
    categoryId: 'cat-massas',
    name: 'Risoto de Cogumelos Frescos e Azeite Trufado',
    description: 'Arroz arbóreo mantecado ao vinho branco, mix de shimeji, shitake e cogumelos Paris salteados, finalizado com manteiga e parmesão Grana Padano 18 meses.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Vegetariano',
    preparationTimeMinutes: 22,
    tags: ['vegetariano', 'sem-gluten'],
    complements: [
      { id: 'comp-16', name: 'Adicionar tiras de mignon grelhado', price: 24.00 },
      { id: 'comp-17', name: 'Parmesão ralado extra', price: 6.00 }
    ]
  },
  {
    id: 'prod-10',
    categoryId: 'cat-massas',
    name: 'Gnocchi Artesanal com Ragu de Ossobuco',
    description: 'Nhoque artesanal de batata doce dourado na manteiga de sálvia, servido com ragu de ossobuco cozido lentamente por 8 horas ao vinho tinto.',
    price: 74.00,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Receita de Família',
    preparationTimeMinutes: 20
  },
  {
    id: 'prod-11',
    categoryId: 'cat-sobremesas',
    name: 'Petit Gâteau de Doce de Leite Viçosa',
    description: 'Bolinho quente recheado com doce de leite cremoso de Minas Gerais derretido por dentro. Acompanha sorvete artesanal de queijo da serra e crocante de nozes.',
    price: 34.00,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Imperdível',
    preparationTimeMinutes: 12,
    tags: ['destaque'],
    complements: [
      { id: 'comp-18', name: 'Bola extra de sorvete', price: 10.00 }
    ]
  },
  {
    id: 'prod-12',
    categoryId: 'cat-sobremesas',
    name: 'Cheesecake Basco com Calda de Frutas Vermelhas',
    description: 'Torta de queijo cremosa com superfície tostada caramelo característica do país basco, coberta por coulis rústico de amoras, mirtilos e morangos frescos.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTimeMinutes: 8
  },
  {
    id: 'prod-13',
    categoryId: 'cat-drinks',
    name: 'Gin Tônica Botânica Hibisco & Tangerina',
    description: 'Gin artesanal infusionado com zimbro e flores de hibisco, xarope de tangerina fresca, água tônica premium e ramo de alecrim maçaricado.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Drink Autoral',
    preparationTimeMinutes: 5,
    tags: ['destaque'],
    complements: [
      { id: 'comp-19', name: 'Dose dupla de Gin', price: 16.00 }
    ]
  },
  {
    id: 'prod-14',
    categoryId: 'cat-drinks',
    name: 'Moscow Mule da Casa na Caneca de Cobre',
    description: 'Vodka premium, suco de limão tahiti espremido na hora, xarope artesanal de gengibre picante e espuma cremosa de gengibre finalizada com raspas de limão.',
    price: 36.00,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5
  },
  {
    id: 'prod-15',
    categoryId: 'cat-drinks',
    name: 'Suco Natural Detox Verde',
    description: 'Abacaxi pérola doce, couve orgânica fresca, gengibre, hortelã e água de coco natural.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTimeMinutes: 6,
    tags: ['vegano', 'sem-gluten']
  },
  {
    id: 'prod-16',
    categoryId: 'cat-drinks',
    name: 'Cerveja Artesanal IPA Puro Malte (500ml)',
    description: 'Cerveja estilo American IPA com amargor equilibrado, aromas cítricos de maracujá e lúpulos americanos selecionados. Teor 6.2%.',
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1608270199042-30238d21213f?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTimeMinutes: 3
  }
];

// Rich sample historical and current orders to power real-time reports instantly
export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#PED-1021',
    tableNumber: '4',
    customerName: 'Lucas Mendes',
    customerPhone: '(11) 99123-4567',
    items: [
      {
        cartItemId: 'item-1',
        product: initialProducts[3], // Bife de Chorizo
        quantity: 2,
        selectedComplements: [
          { id: 'comp-6', name: 'Ponto da carne: Ao ponto', price: 0.00 },
          { id: 'comp-8', name: 'Molho gorgonzola cremoso', price: 12.00 }
        ],
        notes: 'Sem cebola na farofa'
      },
      {
        cartItemId: 'item-2',
        product: initialProducts[12], // Gin Tônica
        quantity: 2,
        selectedComplements: [],
        notes: ''
      }
    ],
    subtotal: 276.00,
    serviceFee: 27.60,
    total: 303.60,
    status: 'preparando',
    paymentMethod: 'cartao_credito',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    notes: 'Comemorando aniversário'
  },
  {
    id: 'ord-102',
    orderNumber: '#PED-1022',
    tableNumber: '7',
    customerName: 'Mariana Silva',
    items: [
      {
        cartItemId: 'item-3',
        product: initialProducts[6], // Smash Trufado
        quantity: 2,
        selectedComplements: [
          { id: 'comp-12', name: 'Bacon fatiado defumado crocante', price: 7.00 },
          { id: 'comp-13', name: 'Batata frita palito rústica com páprica', price: 14.00 }
        ],
        notes: 'Pão bem tostadinho'
      },
      {
        cartItemId: 'item-4',
        product: initialProducts[13], // Moscow Mule
        quantity: 2,
        selectedComplements: [],
        notes: ''
      }
    ],
    subtotal: 185.00,
    serviceFee: 18.50,
    total: 203.50,
    status: 'recebido',
    paymentMethod: 'pix',
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-103',
    orderNumber: '#PED-1023',
    tableNumber: '2',
    customerName: 'Roberto Alves',
    items: [
      {
        cartItemId: 'item-5',
        product: initialProducts[8], // Risoto de Cogumelos
        quantity: 1,
        selectedComplements: [
          { id: 'comp-16', name: 'Adicionar tiras de mignon grelhado', price: 24.00 }
        ],
        notes: ''
      },
      {
        cartItemId: 'item-6',
        product: initialProducts[14], // Suco Detox
        quantity: 1,
        selectedComplements: [],
        notes: 'Sem gelo'
      }
    ],
    subtotal: 110.00,
    serviceFee: 11.00,
    total: 121.00,
    status: 'pronto',
    paymentMethod: 'pagar_na_mesa',
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-104',
    orderNumber: '#PED-1018',
    tableNumber: '11',
    customerName: 'Beatriz Costa',
    items: [
      {
        cartItemId: 'item-7',
        product: initialProducts[0], // Dadinhos de Tapioca
        quantity: 1,
        selectedComplements: [
          { id: 'comp-1', name: 'Porção extra de geleia de pimenta', price: 6.00 }
        ],
        notes: ''
      },
      {
        cartItemId: 'item-8',
        product: initialProducts[4], // Prime Rib
        quantity: 1,
        selectedComplements: [
          { id: 'comp-10', name: 'Arroz biro-biro com ovo caipira e palha', price: 18.00 }
        ],
        notes: 'Ponto menos'
      },
      {
        cartItemId: 'item-9',
        product: initialProducts[10], // Petit Gâteau
        quantity: 2,
        selectedComplements: [],
        notes: ''
      }
    ],
    subtotal: 276.90,
    serviceFee: 27.69,
    total: 304.59,
    status: 'entregue',
    paymentMethod: 'cartao_credito',
    createdAt: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-105',
    orderNumber: '#PED-1017',
    tableNumber: '5',
    customerName: 'Thiago Oliveira',
    items: [
      {
        cartItemId: 'item-10',
        product: initialProducts[7], // Brie Burger
        quantity: 2,
        selectedComplements: [],
        notes: ''
      },
      {
        cartItemId: 'item-11',
        product: initialProducts[15], // Cerveja IPA
        quantity: 3,
        selectedComplements: [],
        notes: 'Copos gelados por favor'
      }
    ],
    subtotal: 182.00,
    serviceFee: 18.20,
    total: 200.20,
    status: 'entregue',
    paymentMethod: 'pix',
    createdAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString()
  }
];
