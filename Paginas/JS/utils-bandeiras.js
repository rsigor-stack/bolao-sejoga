// ============================================================================
// PERFIL PALPITES
// utils-bandeiras.js
// Utilitários para bandeiras e países
// ============================================================================

'use strict';

// ============================================================================
// MAPA FIFA (TRIGRAMA) → ISO 3166-1 (FlagCDN)
// ============================================================================

const MAPA_BANDEIRAS = Object.freeze({

    // AFC
    AUS: 'au',
    IRQ: 'iq',
    IRN: 'ir',
    JPN: 'jp',
    JOR: 'jo',
    KOR: 'kr',
    KSA: 'sa',
    QAT: 'qa',
    UZB: 'uz',

    // CAF
    ALG: 'dz',
    CIV: 'ci',
    COD: 'cd',
    CPV: 'cv',
    EGY: 'eg',
    GHA: 'gh',
    MAR: 'ma',
    RSA: 'za',
    SEN: 'sn',
    TUN: 'tn',

    // CONCACAF
    CAN: 'ca',
    CUW: 'cw',
    HAI: 'ht',
    MEX: 'mx',
    PAN: 'pa',
    USA: 'us',

    // CONMEBOL
    ARG: 'ar',
    BRA: 'br',
    COL: 'co',
    ECU: 'ec',
    PAR: 'py',
    URU: 'uy',

    // OFC
    NZL: 'nz',

    // UEFA
    AUT: 'at',
    BEL: 'be',
    BIH: 'ba',
    CRO: 'hr',
    CZE: 'cz',
    ENG: 'gb-eng',
    ESP: 'es',
    FRA: 'fr',
    GER: 'de',
    NED: 'nl',
    NOR: 'no',
    POR: 'pt',
    SCO: 'gb-sct',
    SUI: 'ch',
    SWE: 'se',
    TUR: 'tr'

});


// ============================================================================
// CONSTANTES VISUAIS
// ============================================================================

const FLAG_STYLE_SM = [
    'width:26px',
    'height:19px',
    'border-radius:2px',
    'object-fit:cover',
    'display:block',
    'margin:0 auto 2px'
].join(';');


// ============================================================================
// BANDEIRAS FIFA
// ============================================================================

const BANDEIRAS = Object.freeze({

    // CONMEBOL
    Argentina:'ar',
    Brasil:'br',
    Colômbia:'co',
    Equador:'ec',
    Paraguai:'py',
    Uruguai:'uy',

    // CONCACAF
    Canadá:'ca',
    Curaçao:'cw',
    'Estados Unidos':'us',
    Haiti:'ht',
    México:'mx',
    Panamá:'pa',

    // UEFA
    Alemanha:'de',
    Áustria:'at',
    Bélgica:'be',
    'Bósnia e Herzegovina':'ba',
    Croácia:'hr',
    Escócia:'gb-sct',
    Espanha:'es',
    França:'fr',
    Holanda:'nl',
    Inglaterra:'gb-eng',
    Noruega:'no',
    Portugal:'pt',
    'República Tcheca':'cz',
    Suécia:'se',
    Suíça:'ch',
    Turquia:'tr',

    // CAF
    'África do Sul':'za',
    Argélia:'dz',
    'Cabo Verde':'cv',
    'RD Congo':'cd',
    'Costa do Marfim':'ci',
    Egito:'eg',
    Gana:'gh',
    Marrocos:'ma',
    Senegal:'sn',
    Tunísia:'tn',

    // AFC
    'Arábia Saudita':'sa',
    Austrália:'au',
    'Coreia do Sul':'kr',
    Iraque:'iq',
    Irã:'ir',
    Japão:'jp',
    Jordânia:'jo',
    Catar:'qa',
    Uzbequistão:'uz',

    // OFC
    'Nova Zelândia':'nz'

});

// ============================================================================
// TRIGRAMAS FIFA
// ============================================================================

const TRIGRAMAS = Object.freeze({

    Argentina:'ARG',
    Brasil:'BRA',
    Colômbia:'COL',
    Equador:'ECU',
    Paraguai:'PAR',
    Uruguai:'URU',

    Canadá:'CAN',
    Curaçao:'CUW',
    'Estados Unidos':'USA',
    Haiti:'HAI',
    México:'MEX',
    Panamá:'PAN',

    Alemanha:'GER',
    Áustria:'AUT',
    Bélgica:'BEL',
    'Bósnia e Herzegovina':'BIH',
    Croácia:'CRO',
    Escócia:'SCO',
    Espanha:'ESP',
    França:'FRA',
    Holanda:'NED',
    Inglaterra:'ENG',
    Noruega:'NOR',
    Portugal:'POR',
    'República Tcheca':'CZE',
    Suécia:'SWE',
    Suíça:'SUI',
    Turquia:'TUR',

    'África do Sul':'RSA',
    Argélia:'ALG',
    'Cabo Verde':'CPV',
    'Congo DR':'COD',
    'Costa do Marfim':'CIV',
    Egito:'EGY',
    Gana:'GHA',
    Marrocos:'MAR',
    Senegal:'SEN',
    Tunísia:'TUN',

    'Arábia Saudita':'KSA',
    Austrália:'AUS',
    'Coreia do Sul':'KOR',
    Iraque:'IRQ',
    Irã:'IRN',
    Japão:'JPN',
    Jordânia:'JOR',
    Catar:'QAT',
    Uzbequistão:'UZB',

    'Nova Zelândia':'NZL'

});

// ============================================================================
// URL DA BANDEIRA
// ============================================================================

function getBandeira(trigrama, largura = 40) {

    const codigo = MAPA_BANDEIRAS[trigrama];

    if (!codigo)
        return '';

    return `https://flagcdn.com/w${largura}/${codigo}.png`;

}

// ============================================================================
// VERIFICA SE EXISTE BANDEIRA
// ============================================================================

function possuiBandeira(trigrama) {

    return Boolean(MAPA_BANDEIRAS[trigrama]);

}

// ============================================================================
// EXPORTAÇÃO
// ============================================================================

// Object.freeze(getBandeira);
// Object.freeze(possuiBandeira);
