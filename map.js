/* ============================================================
   BOX MACHINE — map.js
   Mapa interativo usando Leaflet.js + dados do points.json

   PARA ADICIONAR NOVOS PONTOS NO MAPA:
   1. Abra o arquivo /data/points.json
   2. Copie um bloco existente e cole abaixo do último
   3. Preencha os dados do novo ponto
   4. Salve o arquivo — o mapa atualiza automaticamente

   PARA DESCOBRIR LATITUDE E LONGITUDE DE UM LOCAL:
   1. Acesse maps.google.com
   2. Clique com botão direito no local desejado
   3. Clique em "O que há aqui?"
   4. Os números que aparecem são lat e lng
   ============================================================ */

/* --- CORES POR CATEGORIA --- */
const categoryColors = {
  hospital:   '#00D4FF',
  escola:     '#00FF88',
  academia:   '#FFD700',
  empresa:    '#FF8C00',
  condominio: '#FF4488',
  outro:      '#AAAAAA'
};

/* --- ÍCONE PERSONALIZADO POR CATEGORIA --- */
function createIcon(category) {
  const color = categoryColors[category] || categoryColors.outro;

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="glow-${category}">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z"
        fill="${color}"
        filter="url(#glow-${category})"
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="7" fill="#0A0A0A"/>
      <circle cx="16" cy="16" r="4" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    html:        svgIcon,
    iconSize:    [32, 42],
    iconAnchor:  [16, 42],
    popupAnchor: [0, -44],
    className:   ''
  });
}

/* --- VARIÁVEIS GLOBAIS --- */
let map;
let allMarkers = [];

/* --- INICIALIZA O MAPA --- */
function initMap(points) {
  /* Centro inicial do Brasil */
  map = L.map('map', {
    center:      [-15.7801, -47.9292],
    zoom:        5,
    zoomControl: true
  });

  /* Tile escuro (combina com o design preto + neon) */
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains:  'abcd',
      maxZoom:     19
    }
  ).addTo(map);

  /* Adiciona cada ponto do JSON como marcador no mapa */
  points.forEach(point => {
    const marker = L.marker(
      [point.lat, point.lng],
      { icon: createIcon(point.category) }
    );

    /* Popup ao clicar no marcador */
    marker.bindPopup(`
      <div style="
        font-family: 'Inter', sans-serif;
        min-width: 180px;
      ">
        <div style="
          font-weight: 600;
          color: ${categoryColors[point.category] || '#00D4FF'};
          font-size: 0.95rem;
          margin-bottom: 4px;
        ">
          ${point.name}
        </div>
        <div style="
          font-size: 0.78rem;
          color: #888;
          margin-bottom: 4px;
        ">
          ${point.type}
        </div>
        <div style="
          font-size: 0.75rem;
          color: #666;
        ">
          📍 ${point.address}
        </div>
      </div>
    `);

    /* Guarda a categoria no marcador para filtro */
    marker.category = point.category;

    marker.addTo(map);
    allMarkers.push(marker);
  });

  /* Se não há pontos, exibe mensagem */
  if (points.length === 0) {
    console.info('Nenhum ponto encontrado em points.json.');
  }
}

/* --- FILTRO POR CATEGORIA --- */
function filterMarkers(category) {
  allMarkers.forEach(marker => {
    const show = category === 'todos' || marker.category === category;

    if (show && !map.hasLayer(marker)) {
      marker.addTo(map);
    } else if (!show && map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });
}

/* --- BOTÕES DE FILTRO --- */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    /* Remove active de todos */
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
    });

    /* Ativa o clicado */
    btn.classList.add('active');

    /* Aplica o filtro */
    filterMarkers(btn.dataset.filter);
  });
});

/* --- CARREGA OS PONTOS DO JSON E INICIALIZA --- */
fetch('/data/points.json')
  .then(res => {
    if (!res.ok) throw new Error('Erro ao carregar points.json');
    return res.json();
  })
  .then(data => {
    initMap(data);
  })
  .catch(err => {
    console.warn('Não foi possível carregar points.json:', err);
    /* Inicializa o mapa vazio caso o JSON falhe */
    initMap([]);
  });
