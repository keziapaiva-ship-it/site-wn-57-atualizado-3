/* =========================================================
   WN57 - PAGAMENTO
   - PIX copia e cola válido (BR Code com CRC16) + QR Code + contador
   - Cartão com máscara, bandeira, Luhn, validade, CVV e prévia 3D
   - Parcelas, cupom de desconto e resumo da viagem
   - Comprovante salvo no localStorage (nunca salva dados do cartão)

   ⚠️ Este arquivo SIMULA a aprovação. Para cobrar de verdade é preciso
   um backend/gateway (Mercado Pago, Stripe, Pagar.me...). Os pontos onde
   isso entra estão marcados com "INTEGRAÇÃO".
========================================================= */

(() => {
  'use strict';

  /* =======================================================
     CONFIGURAÇÃO (troque pelos dados reais da WN57)
  ======================================================= */
  const CONFIG = {
    chavePix: 'pagamentos@wn57.com.br',      // <- sua chave PIX real
    recebedor: 'WN57 TECNOLOGIA',            // até 25 caracteres
    cidade: 'PINHAIS',                       // até 15 caracteres
    pixExpiraSeg: 600,                       // 10 minutos
    maxParcelas: 3,
    parcelaMinima: 10,                       // R$ mínimo por parcela
    cupons: {
      WN10: { tipo: 'percentual', valor: 10, descricao: '10% de desconto' },
      BEMVINDO: { tipo: 'fixo', valor: 5, descricao: 'R$ 5,00 de desconto' }
    },
    valorPadrao: 24.90,                      // usado se nenhuma corrida for encontrada
    chaveCorrida: 'wn57_corrida',            // localStorage: corrida a pagar
    chavePagamentos: 'wn57_pagamentos'       // localStorage: histórico de pagamentos
  };

  /* =======================================================
     UTILITÁRIOS
  ======================================================= */
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const arredondar = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const soDigitos = s => String(s).replace(/\D/g, '');
  const semAcento = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const estado = {
    metodo: 'pix',
    corrida: null,
    cupom: null,
    processando: false,
    pixPayload: '',
    pixExpira: 0,
    pixExpirado: false,
    pixTimer: null,
    toastTimer: null
  };

  /* =======================================================
     DADOS DA CORRIDA
     Lê de ?valor=24.90&origem=...&destino=...&tempo=... ou de
     localStorage 'wn57_corrida' (JSON). No solicita.js, antes de
     redirecionar para o pagamento, salve assim:

     localStorage.setItem('wn57_corrida', JSON.stringify({
       valor: 24.9, origem: 'Sua localização', destino: 'Aeroporto', tempo: '18 min'
     }));
  ======================================================= */
  function carregarCorrida() {
    const params = new URLSearchParams(location.search);
    let salvo = {};

    try {
      salvo = JSON.parse(localStorage.getItem(CONFIG.chaveCorrida)) || {};
    } catch {
      salvo = {};
    }

    const bruto = params.get('valor') ?? salvo.valor ?? CONFIG.valorPadrao;
    let valor = parseFloat(String(bruto).replace(/[^\d,.-]/g, '').replace(',', '.'));
    if (!Number.isFinite(valor) || valor <= 0) valor = CONFIG.valorPadrao;

    return {
      valor: arredondar(valor),
      origem: params.get('origem') || salvo.origem || 'Sua localização',
      destino: params.get('destino') || salvo.destino || 'Destino não informado',
      tempo: params.get('tempo') || salvo.tempo || '--'
    };
  }

  /* =======================================================
     TOTAIS E RESUMO
  ======================================================= */
  function calcularTotais() {
    const subtotal = estado.corrida.valor;
    let desconto = 0;

    if (estado.cupom) {
      desconto = estado.cupom.tipo === 'percentual'
        ? subtotal * (estado.cupom.valor / 100)
        : estado.cupom.valor;
    }

    desconto = arredondar(Math.min(desconto, Math.max(subtotal - 1, 0)));

    return { subtotal, desconto, total: arredondar(subtotal - desconto) };
  }

  function renderResumo() {
    const { subtotal, desconto, total } = calcularTotais();

    $('#resOrigem').textContent = estado.corrida.origem;
    $('#resDestino').textContent = estado.corrida.destino;
    $('#resTempo').textContent = estado.corrida.tempo;

    $('#resSubtotal').textContent = moeda.format(subtotal);
    $('#resTotal').textContent = moeda.format(total);

    $('#linhaDesconto').hidden = desconto <= 0;
    $('#resDesconto').textContent = '- ' + moeda.format(desconto);

    renderParcelas();
    atualizarBotao();
  }

  /* =======================================================
     CUPOM
  ======================================================= */
  function aplicarCupom() {
    const campo = $('#cupom');
    const msg = $('#cupomMsg');
    const botao = $('#btnCupom');

    // Já tem cupom -> o botão vira "Remover"
    if (estado.cupom) {
      estado.cupom = null;
      campo.value = '';
      campo.disabled = false;
      botao.textContent = 'Aplicar';
      msg.className = 'cupom-msg';
      msg.textContent = '';
      aoMudarValor();
      return;
    }

    const codigo = campo.value.trim().toUpperCase();
    if (!codigo) {
      msg.className = 'cupom-msg erro';
      msg.textContent = 'Digite um cupom.';
      return;
    }

    const cupom = CONFIG.cupons[codigo];
    if (!cupom) {
      msg.className = 'cupom-msg erro';
      msg.textContent = 'Cupom inválido ou expirado.';
      return;
    }

    estado.cupom = cupom;
    campo.value = codigo;
    campo.disabled = true;
    botao.textContent = 'Remover';
    msg.className = 'cupom-msg ok';
    msg.textContent = `Cupom aplicado: ${cupom.descricao}.`;
    aoMudarValor();
  }

  // Quando o total muda, o PIX precisa ser gerado de novo (valor dentro do código)
  function aoMudarValor() {
    renderResumo();
    gerarPix();
  }

  /* =======================================================
     PIX (BR Code oficial do Banco Central)
  ======================================================= */
  const tlv = (id, valor) => id + String(valor.length).padStart(2, '0') + valor;

  function crc16(texto) {
    let crc = 0xFFFF;
    for (let i = 0; i < texto.length; i++) {
      crc ^= texto.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function gerarPayloadPix({ chave, nome, cidade, valor, txid }) {
    const limpar = (s, max) => semAcento(s).toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, max);

    const conta = tlv('00', 'BR.GOV.BCB.PIX') + tlv('01', chave);

    const corpo =
      tlv('00', '01') +
      tlv('26', conta) +
      tlv('52', '0000') +
      tlv('53', '986') +
      tlv('54', valor.toFixed(2)) +
      tlv('58', 'BR') +
      tlv('59', limpar(nome, 25)) +
      tlv('60', limpar(cidade, 15)) +
      tlv('62', tlv('05', txid.replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***')) +
      '6304';

    return corpo + crc16(corpo);
  }

  function gerarPix() {
    const { total } = calcularTotais();
    const txid = 'WN57' + Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    estado.pixPayload = gerarPayloadPix({
      chave: CONFIG.chavePix,
      nome: CONFIG.recebedor,
      cidade: CONFIG.cidade,
      valor: total,
      txid
    });

    $('#pixCodigo').value = estado.pixPayload;
    $('#pixQr').src =
      'https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=' +
      encodeURIComponent(estado.pixPayload);

    // Reinicia o contador
    estado.pixExpirado = false;
    estado.pixExpira = Date.now() + CONFIG.pixExpiraSeg * 1000;
    $('#pixStatus').classList.remove('expirado');
    $('#pixStatusTxt').textContent = 'Aguardando pagamento';
    $('#btnNovoPix').hidden = true;

    clearInterval(estado.pixTimer);
    estado.pixTimer = setInterval(tickPix, 1000);
    tickPix();
    atualizarBotao();
  }

  function tickPix() {
    const resta = Math.max(0, Math.ceil((estado.pixExpira - Date.now()) / 1000));
    const mm = String(Math.floor(resta / 60)).padStart(2, '0');
    const ss = String(resta % 60).padStart(2, '0');
    $('#pixTempo').textContent = `${mm}:${ss}`;

    if (resta === 0 && !estado.pixExpirado) {
      estado.pixExpirado = true;
      clearInterval(estado.pixTimer);
      $('#pixStatus').classList.add('expirado');
      $('#pixStatusTxt').textContent = 'Código expirado';
      $('#btnNovoPix').hidden = false;
      atualizarBotao();
    }
  }

  async function copiarPix() {
    if (estado.pixExpirado) return toast('Esse código expirou. Gere um novo.');

    let ok = false;
    try {
      await navigator.clipboard.writeText(estado.pixPayload);
      ok = true;
    } catch {
      const campo = $('#pixCodigo');
      campo.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
    }

    toast(ok ? 'Código PIX copiado!' : 'Não foi possível copiar. Selecione e copie manualmente.');
  }

  /* =======================================================
     MÉTODO DE PAGAMENTO
  ======================================================= */
  function selecionarMetodo(metodo) {
    estado.metodo = metodo;

    $$('.metodo').forEach(btn => {
      const ativo = btn.dataset.metodo === metodo;
      btn.classList.toggle('ativo', ativo);
      btn.setAttribute('aria-checked', ativo);
    });

    $('#painelPix').hidden = metodo !== 'pix';
    $('#painelCartao').hidden = metodo !== 'cartao';

    atualizarBotao();
  }

  function atualizarBotao() {
    const botao = $('#btnFinalizar');
    if (!botao || botao.classList.contains('carregando')) return;

    const { total } = calcularTotais();

    if (estado.metodo === 'pix') {
      botao.textContent = 'Já paguei com PIX';
      botao.disabled = estado.pixExpirado;
    } else {
      botao.textContent = `Pagar ${moeda.format(total)}`;
      botao.disabled = false;
    }
  }

  /* =======================================================
     CARTÃO
  ======================================================= */
  const BANDEIRAS = [
    { id: 'elo', nome: 'Elo', re: /^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/, len: [16], cvv: 3 },
    { id: 'hipercard', nome: 'Hipercard', re: /^(606282|3841)/, len: [16], cvv: 3 },
    { id: 'amex', nome: 'Amex', re: /^3[47]/, len: [15], cvv: 4 },
    { id: 'diners', nome: 'Diners', re: /^3(0[0-5]|[68])/, len: [14], cvv: 3 },
    { id: 'visa', nome: 'Visa', re: /^4/, len: [13, 16, 19], cvv: 3 },
    { id: 'mastercard', nome: 'Mastercard', re: /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/, len: [16], cvv: 3 }
  ];

  const detectarBandeira = n => BANDEIRAS.find(b => b.re.test(n)) || null;

  function formatarNumero(n, bandeira) {
    const max = bandeira ? Math.max(...bandeira.len) : 19;
    n = n.slice(0, max);

    if (bandeira?.id === 'amex') {
      return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)].filter(Boolean).join(' ');
    }
    if (bandeira?.id === 'diners') {
      return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 14)].filter(Boolean).join(' ');
    }
    return n.replace(/(.{4})/g, '$1 ').trim();
  }

  function luhn(n) {
    let soma = 0;
    let dobrar = false;
    for (let i = n.length - 1; i >= 0; i--) {
      let d = Number(n[i]);
      if (dobrar) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      soma += d;
      dobrar = !dobrar;
    }
    return n.length > 0 && soma % 10 === 0;
  }

  /* ---------- Validadores (retornam '' se válido) ---------- */
  const validadores = {
    numero() {
      const n = soDigitos($('#numero').value);
      if (!n) return 'Informe o número do cartão.';
      const b = detectarBandeira(n);
      const tamanhoOk = b ? b.len.includes(n.length) : (n.length >= 13 && n.length <= 19);
      if (!tamanhoOk || !luhn(n)) return 'Número de cartão inválido.';
      return '';
    },

    nome() {
      const v = $('#nome').value.trim();
      if (!v) return 'Informe o nome impresso no cartão.';
      if (v.split(/\s+/).length < 2 || v.length < 5) return 'Digite o nome completo, como está no cartão.';
      return '';
    },

    validade() {
      const v = $('#validade').value;
      const m = /^(\d{2})\/(\d{2})$/.exec(v);
      if (!m) return 'Use o formato MM/AA.';
      const mes = Number(m[1]);
      const ano = 2000 + Number(m[2]);
      if (mes < 1 || mes > 12) return 'Mês inválido.';
      // vale até o último dia do mês de validade
      if (new Date(ano, mes, 1) <= new Date()) return 'Cartão vencido.';
      return '';
    },

    cvv() {
      const v = soDigitos($('#cvv').value);
      const b = detectarBandeira(soDigitos($('#numero').value));
      const esperado = b ? b.cvv : null;
      if (!v) return 'Informe o CVV.';
      if (esperado ? v.length !== esperado : (v.length < 3 || v.length > 4)) {
        return `O CVV deve ter ${esperado || '3 ou 4'} dígitos.`;
      }
      return '';
    }
  };

  function mostrarErro(campo, mensagem) {
    const input = $('#' + campo);
    const span = $('#erro-' + campo);
    input.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
    if (span) span.textContent = mensagem;
  }

  function validarCampo(campo) {
    const msg = validadores[campo]();
    mostrarErro(campo, msg);
    return !msg;
  }

  function validarCartao() {
    const campos = ['numero', 'nome', 'validade', 'cvv'];
    const invalidos = campos.filter(c => !validarCampo(c));
    if (invalidos.length) {
      $('#' + invalidos[0]).focus();
      return false;
    }
    return true;
  }

  /* ---------- Máscaras + prévia do cartão ---------- */
  function iniciarCartao() {
    const numero = $('#numero');
    const nome = $('#nome');
    const validade = $('#validade');
    const cvv = $('#cvv');
    const cartao3d = $('#cartao3d');

    numero.addEventListener('input', () => {
      const n = soDigitos(numero.value);
      const b = detectarBandeira(n);
      numero.value = formatarNumero(n, b);

      $('#pvNumero').textContent = numero.value || '•••• •••• •••• ••••';
      $('#pvBandeira').textContent = b ? b.nome : 'CARTÃO';

      // ajusta o tamanho máximo do CVV (Amex = 4)
      cvv.maxLength = b ? b.cvv : 4;
      if (numero.getAttribute('aria-invalid') === 'true') validarCampo('numero');
    });

    nome.addEventListener('input', () => {
      nome.value = semAcento(nome.value).toUpperCase().replace(/[^A-Z' ]/g, '');
      $('#pvNome').textContent = nome.value.trim() || 'NOME NO CARTÃO';
      if (nome.getAttribute('aria-invalid') === 'true') validarCampo('nome');
    });

    validade.addEventListener('input', () => {
      let d = soDigitos(validade.value).slice(0, 4);
      // mês começando com 2-9 vira 02-09 automaticamente
      if (d.length === 1 && Number(d) > 1) d = '0' + d;
      validade.value = d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
      $('#pvValidade').textContent = validade.value || 'MM/AA';
      if (validade.getAttribute('aria-invalid') === 'true') validarCampo('validade');
    });

    cvv.addEventListener('input', () => {
      cvv.value = soDigitos(cvv.value).slice(0, cvv.maxLength);
      $('#pvCvv').textContent = cvv.value ? '•'.repeat(cvv.value.length) : '•••';
      if (cvv.getAttribute('aria-invalid') === 'true') validarCampo('cvv');
    });

    // Vira o cartão ao digitar o CVV
    cvv.addEventListener('focus', () => cartao3d.classList.add('virado'));
    cvv.addEventListener('blur', () => cartao3d.classList.remove('virado'));

    // Valida ao sair do campo
    ['numero', 'nome', 'validade', 'cvv'].forEach(c => {
      $('#' + c).addEventListener('blur', () => {
        if ($('#' + c).value) validarCampo(c);
      });
    });
  }

  function limparCartao() {
    ['numero', 'nome', 'validade', 'cvv'].forEach(c => {
      $('#' + c).value = '';
      mostrarErro(c, '');
    });
    $('#pvNumero').textContent = '•••• •••• •••• ••••';
    $('#pvNome').textContent = 'NOME NO CARTÃO';
    $('#pvValidade').textContent = 'MM/AA';
    $('#pvCvv').textContent = '•••';
    $('#pvBandeira').textContent = 'CARTÃO';
  }

  /* ---------- Parcelas ---------- */
  function renderParcelas() {
    const select = $('#parcelas');
    const { total } = calcularTotais();
    const anterior = Number(select.value) || 1;

    const maximo = Math.max(1, Math.min(CONFIG.maxParcelas, Math.floor(total / CONFIG.parcelaMinima)));

    select.innerHTML = '';
    for (let i = 1; i <= maximo; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i === 1
        ? `1x de ${moeda.format(total)} (à vista)`
        : `${i}x de ${moeda.format(arredondar(total / i))} sem juros`;
      select.appendChild(opt);
    }
    select.value = String(Math.min(anterior, maximo));
  }

  /* =======================================================
     FINALIZAR PAGAMENTO
  ======================================================= */
  function finalizar(e) {
    e.preventDefault();
    if (estado.processando) return;

    if (estado.metodo === 'cartao') {
      if (!validarCartao()) return;
    } else if (estado.pixExpirado) {
      return toast('Esse código PIX expirou. Gere um novo.');
    }

    processarPagamento();
  }

  function processarPagamento() {
    estado.processando = true;

    const botao = $('#btnFinalizar');
    botao.disabled = true;
    botao.classList.add('carregando');
    botao.textContent = estado.metodo === 'pix' ? 'Confirmando PIX' : 'Processando pagamento';

    /* INTEGRAÇÃO: aqui entra a chamada ao seu backend/gateway, por exemplo:
       fetch('/api/pagamentos', { method: 'POST', body: JSON.stringify({...}) })
       Para cartão, envie o token gerado pelo gateway, nunca o número do cartão.
       Para PIX, o ideal é o servidor confirmar via webhook. */
    const atraso = estado.metodo === 'pix' ? 1200 : 2000;

    setTimeout(() => {
      const comprovante = montarComprovante();
      salvarComprovante(comprovante);

      clearInterval(estado.pixTimer);
      if (estado.metodo === 'cartao') limparCartao();

      botao.classList.remove('carregando');
      estado.processando = false;

      mostrarSucesso(comprovante);
    }, atraso);
  }

  function montarComprovante() {
    const { total } = calcularTotais();
    const numero = soDigitos($('#numero').value);
    const bandeira = detectarBandeira(numero);
    const parcelas = Number($('#parcelas').value) || 1;

    let forma = 'PIX';
    if (estado.metodo === 'cartao') {
      forma = `${bandeira ? bandeira.nome : 'Cartão'} •••• ${numero.slice(-4)} · ${parcelas}x`;
    }

    return {
      id: 'WN57-' + Date.now().toString(36).toUpperCase() +
        Math.random().toString(36).slice(2, 5).toUpperCase(),
      metodo: estado.metodo,
      forma,
      total,
      origem: estado.corrida.origem,
      destino: estado.corrida.destino,
      data: new Date().toISOString(),
      status: 'pago'
    };
  }

  function salvarComprovante(comprovante) {
    try {
      const lista = JSON.parse(localStorage.getItem(CONFIG.chavePagamentos) || '[]');
      lista.unshift(comprovante);
      localStorage.setItem(CONFIG.chavePagamentos, JSON.stringify(lista.slice(0, 50)));
      localStorage.removeItem(CONFIG.chaveCorrida); // corrida já paga
    } catch {
      /* localStorage indisponível: segue sem salvar */
    }
  }

  function mostrarSucesso(c) {
    $('#cpId').textContent = c.id;
    $('#cpForma').textContent = c.forma;
    $('#cpValor').textContent = moeda.format(c.total);
    $('#cpData').textContent = new Date(c.data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });

    const modal = $('#modalSucesso');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#linkAtividade').focus();
  }

  /* =======================================================
     TOAST
  ======================================================= */
  function toast(texto) {
    const el = $('#toast');
    el.textContent = texto;
    el.classList.add('mostrar');
    clearTimeout(estado.toastTimer);
    estado.toastTimer = setTimeout(() => el.classList.remove('mostrar'), 2500);
  }

  /* =======================================================
     INICIALIZAÇÃO
  ======================================================= */
  function iniciar() {
    estado.corrida = carregarCorrida();

    // Métodos
    $$('.metodo').forEach(btn =>
      btn.addEventListener('click', () => selecionarMetodo(btn.dataset.metodo))
    );

    // PIX
    $('#btnCopiar').addEventListener('click', copiarPix);
    $('#btnNovoPix').addEventListener('click', () => {
      gerarPix();
      toast('Novo código PIX gerado.');
    });
    $('#pixCodigo').addEventListener('focus', e => e.target.select());

    // Cupom
    $('#btnCupom').addEventListener('click', aplicarCupom);
    $('#cupom').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        aplicarCupom();
      }
    });

    // Cartão
    iniciarCartao();

    // Envio
    $('#formPagamento').addEventListener('submit', finalizar);

    // Segurança: não deixa o Enter dentro dos campos do cartão enviar por engano
    // antes da validação (o submit já valida, mas evitamos duplo clique)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('#modalSucesso').hidden) {
        // o modal de sucesso não fecha com ESC de propósito: o pagamento já foi feito
        // e o usuário deve escolher um dos botões.
        e.preventDefault();
      }
    });

    renderResumo();
    gerarPix();
    selecionarMetodo('pix');
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();

/* =========================================================
   WN57 - PAGAMENTO
   - PIX copia e cola válido (BR Code com CRC16) + QR Code + contador
   - Cartão com máscara, bandeira, Luhn, validade, CVV e prévia 3D
   - Parcelas, cupom de desconto e resumo da viagem
   - Comprovante salvo no localStorage (nunca salva dados do cartão)

   ⚠️ Este arquivo SIMULA a aprovação. Para cobrar de verdade é preciso
   um backend/gateway (Mercado Pago, Stripe, Pagar.me...). Os pontos onde
   isso entra estão marcados com "INTEGRAÇÃO".
========================================================= */

(() => {
  'use strict';

  /* =======================================================
     CONFIGURAÇÃO (troque pelos dados reais da WN57)
  ======================================================= */
  const CONFIG = {
    chavePix: 'pagamentos@wn57.com.br',      // <- sua chave PIX real
    recebedor: 'WN57 TECNOLOGIA',            // até 25 caracteres
    cidade: 'PINHAIS',                       // até 15 caracteres
    pixExpiraSeg: 600,                       // 10 minutos
    maxParcelas: 3,
    parcelaMinima: 10,                       // R$ mínimo por parcela
    cupons: {
      WN10: { tipo: 'percentual', valor: 10, descricao: '10% de desconto' },
      BEMVINDO: { tipo: 'fixo', valor: 5, descricao: 'R$ 5,00 de desconto' }
    },
    valorPadrao: 24.90,                      // usado se nenhuma corrida for encontrada
    chaveCorrida: 'wn57_corrida',            // localStorage: corrida a pagar
    chavePagamentos: 'wn57_pagamentos'       // localStorage: histórico de pagamentos
  };

  /* =======================================================
     UTILITÁRIOS
  ======================================================= */
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const arredondar = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const soDigitos = s => String(s).replace(/\D/g, '');
  const semAcento = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const estado = {
    metodo: 'pix',
    corrida: null,
    cupom: null,
    processando: false,
    pixPayload: '',
    pixExpira: 0,
    pixExpirado: false,
    pixTimer: null,
    toastTimer: null
  };

  /* =======================================================
     DADOS DA CORRIDA
     Lê de ?valor=24.90&origem=...&destino=...&tempo=... ou de
     localStorage 'wn57_corrida' (JSON). No solicita.js, antes de
     redirecionar para o pagamento, salve assim:

     localStorage.setItem('wn57_corrida', JSON.stringify({
       valor: 24.9, origem: 'Sua localização', destino: 'Aeroporto', tempo: '18 min'
     }));
  ======================================================= */
  function carregarCorrida() {
    const params = new URLSearchParams(location.search);
    let salvo = {};

    try {
      salvo = JSON.parse(localStorage.getItem(CONFIG.chaveCorrida)) || {};
    } catch {
      salvo = {};
    }

    const bruto = params.get('valor') ?? salvo.valor ?? CONFIG.valorPadrao;
    let valor = parseFloat(String(bruto).replace(/[^\d,.-]/g, '').replace(',', '.'));
    if (!Number.isFinite(valor) || valor <= 0) valor = CONFIG.valorPadrao;

    return {
      valor: arredondar(valor),
      origem: params.get('origem') || salvo.origem || 'Sua localização',
      destino: params.get('destino') || salvo.destino || 'Destino não informado',
      tempo: params.get('tempo') || salvo.tempo || '--',
      categoria: params.get('categoria') || salvo.categoria || 'WN'
    };
  }

  /* =======================================================
     TOTAIS E RESUMO
  ======================================================= */
  function calcularTotais() {
    const subtotal = estado.corrida.valor;
    let desconto = 0;

    if (estado.cupom) {
      desconto = estado.cupom.tipo === 'percentual'
        ? subtotal * (estado.cupom.valor / 100)
        : estado.cupom.valor;
    }

    desconto = arredondar(Math.min(desconto, Math.max(subtotal - 1, 0)));

    return { subtotal, desconto, total: arredondar(subtotal - desconto) };
  }

  function renderResumo() {
    const { subtotal, desconto, total } = calcularTotais();

    $('#resOrigem').textContent = estado.corrida.origem;
    $('#resDestino').textContent = estado.corrida.destino;
    $('#resTempo').textContent = estado.corrida.tempo;
    $('#resCategoria').textContent = estado.corrida.categoria;

    $('#resSubtotal').textContent = moeda.format(subtotal);
    $('#resTotal').textContent = moeda.format(total);

    $('#linhaDesconto').hidden = desconto <= 0;
    $('#resDesconto').textContent = '- ' + moeda.format(desconto);

    renderParcelas();
    atualizarBotao();
  }

  /* =======================================================
     CUPOM
  ======================================================= */
  function aplicarCupom() {
    const campo = $('#cupom');
    const msg = $('#cupomMsg');
    const botao = $('#btnCupom');

    // Já tem cupom -> o botão vira "Remover"
    if (estado.cupom) {
      estado.cupom = null;
      campo.value = '';
      campo.disabled = false;
      botao.textContent = 'Aplicar';
      msg.className = 'cupom-msg';
      msg.textContent = '';
      aoMudarValor();
      return;
    }

    const codigo = campo.value.trim().toUpperCase();
    if (!codigo) {
      msg.className = 'cupom-msg erro';
      msg.textContent = 'Digite um cupom.';
      return;
    }

    const cupom = CONFIG.cupons[codigo];
    if (!cupom) {
      msg.className = 'cupom-msg erro';
      msg.textContent = 'Cupom inválido ou expirado.';
      return;
    }

    estado.cupom = cupom;
    campo.value = codigo;
    campo.disabled = true;
    botao.textContent = 'Remover';
    msg.className = 'cupom-msg ok';
    msg.textContent = `Cupom aplicado: ${cupom.descricao}.`;
    aoMudarValor();
  }

  // Quando o total muda, o PIX precisa ser gerado de novo (valor dentro do código)
  function aoMudarValor() {
    renderResumo();
    gerarPix();
  }

  /* =======================================================
     PIX (BR Code oficial do Banco Central)
  ======================================================= */
  const tlv = (id, valor) => id + String(valor.length).padStart(2, '0') + valor;

  function crc16(texto) {
    let crc = 0xFFFF;
    for (let i = 0; i < texto.length; i++) {
      crc ^= texto.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function gerarPayloadPix({ chave, nome, cidade, valor, txid }) {
    const limpar = (s, max) => semAcento(s).toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, max);

    const conta = tlv('00', 'BR.GOV.BCB.PIX') + tlv('01', chave);

    const corpo =
      tlv('00', '01') +
      tlv('26', conta) +
      tlv('52', '0000') +
      tlv('53', '986') +
      tlv('54', valor.toFixed(2)) +
      tlv('58', 'BR') +
      tlv('59', limpar(nome, 25)) +
      tlv('60', limpar(cidade, 15)) +
      tlv('62', tlv('05', txid.replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***')) +
      '6304';

    return corpo + crc16(corpo);
  }

  function gerarPix() {
    const { total } = calcularTotais();
    const txid = 'WN57' + Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    estado.pixPayload = gerarPayloadPix({
      chave: CONFIG.chavePix,
      nome: CONFIG.recebedor,
      cidade: CONFIG.cidade,
      valor: total,
      txid
    });

    $('#pixCodigo').value = estado.pixPayload;
    $('#pixQr').src =
      'https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=' +
      encodeURIComponent(estado.pixPayload);

    // Reinicia o contador
    estado.pixExpirado = false;
    estado.pixExpira = Date.now() + CONFIG.pixExpiraSeg * 1000;
    $('#pixStatus').classList.remove('expirado');
    $('#pixStatusTxt').textContent = 'Aguardando pagamento';
    $('#btnNovoPix').hidden = true;

    clearInterval(estado.pixTimer);
    estado.pixTimer = setInterval(tickPix, 1000);
    tickPix();
    atualizarBotao();
  }

  function tickPix() {
    const resta = Math.max(0, Math.ceil((estado.pixExpira - Date.now()) / 1000));
    const mm = String(Math.floor(resta / 60)).padStart(2, '0');
    const ss = String(resta % 60).padStart(2, '0');
    $('#pixTempo').textContent = `${mm}:${ss}`;

    if (resta === 0 && !estado.pixExpirado) {
      estado.pixExpirado = true;
      clearInterval(estado.pixTimer);
      $('#pixStatus').classList.add('expirado');
      $('#pixStatusTxt').textContent = 'Código expirado';
      $('#btnNovoPix').hidden = false;
      atualizarBotao();
    }
  }

  async function copiarPix() {
    if (estado.pixExpirado) return toast('Esse código expirou. Gere um novo.');

    let ok = false;
    try {
      await navigator.clipboard.writeText(estado.pixPayload);
      ok = true;
    } catch {
      const campo = $('#pixCodigo');
      campo.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
    }

    toast(ok ? 'Código PIX copiado!' : 'Não foi possível copiar. Selecione e copie manualmente.');
  }

  /* =======================================================
     MÉTODO DE PAGAMENTO
  ======================================================= */
  function selecionarMetodo(metodo) {
    estado.metodo = metodo;

    $$('.metodo').forEach(btn => {
      const ativo = btn.dataset.metodo === metodo;
      btn.classList.toggle('ativo', ativo);
      btn.setAttribute('aria-checked', ativo);
    });

    $('#painelPix').hidden = metodo !== 'pix';
    $('#painelCartao').hidden = metodo !== 'cartao';

    atualizarBotao();
  }

  function atualizarBotao() {
    const botao = $('#btnFinalizar');
    if (!botao || botao.classList.contains('carregando')) return;

    const { total } = calcularTotais();

    if (estado.metodo === 'pix') {
      botao.textContent = 'Já paguei com PIX';
      botao.disabled = estado.pixExpirado;
    } else {
      botao.textContent = `Pagar ${moeda.format(total)}`;
      botao.disabled = false;
    }
  }

  /* =======================================================
     CARTÃO
  ======================================================= */
  const BANDEIRAS = [
    { id: 'elo', nome: 'Elo', re: /^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/, len: [16], cvv: 3 },
    { id: 'hipercard', nome: 'Hipercard', re: /^(606282|3841)/, len: [16], cvv: 3 },
    { id: 'amex', nome: 'Amex', re: /^3[47]/, len: [15], cvv: 4 },
    { id: 'diners', nome: 'Diners', re: /^3(0[0-5]|[68])/, len: [14], cvv: 3 },
    { id: 'visa', nome: 'Visa', re: /^4/, len: [13, 16, 19], cvv: 3 },
    { id: 'mastercard', nome: 'Mastercard', re: /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[01]\d|2720)/, len: [16], cvv: 3 }
  ];

  const detectarBandeira = n => BANDEIRAS.find(b => b.re.test(n)) || null;

  function formatarNumero(n, bandeira) {
    const max = bandeira ? Math.max(...bandeira.len) : 19;
    n = n.slice(0, max);

    if (bandeira?.id === 'amex') {
      return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)].filter(Boolean).join(' ');
    }
    if (bandeira?.id === 'diners') {
      return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 14)].filter(Boolean).join(' ');
    }
    return n.replace(/(.{4})/g, '$1 ').trim();
  }

  function luhn(n) {
    let soma = 0;
    let dobrar = false;
    for (let i = n.length - 1; i >= 0; i--) {
      let d = Number(n[i]);
      if (dobrar) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      soma += d;
      dobrar = !dobrar;
    }
    return n.length > 0 && soma % 10 === 0;
  }

  /* ---------- Validadores (retornam '' se válido) ---------- */
  const validadores = {
    numero() {
      const n = soDigitos($('#numero').value);
      if (!n) return 'Informe o número do cartão.';
      const b = detectarBandeira(n);
      const tamanhoOk = b ? b.len.includes(n.length) : (n.length >= 13 && n.length <= 19);
      if (!tamanhoOk || !luhn(n)) return 'Número de cartão inválido.';
      return '';
    },

    nome() {
      const v = $('#nome').value.trim();
      if (!v) return 'Informe o nome impresso no cartão.';
      if (v.split(/\s+/).length < 2 || v.length < 5) return 'Digite o nome completo, como está no cartão.';
      return '';
    },

    validade() {
      const v = $('#validade').value;
      const m = /^(\d{2})\/(\d{2})$/.exec(v);
      if (!m) return 'Use o formato MM/AA.';
      const mes = Number(m[1]);
      const ano = 2000 + Number(m[2]);
      if (mes < 1 || mes > 12) return 'Mês inválido.';
      // vale até o último dia do mês de validade
      if (new Date(ano, mes, 1) <= new Date()) return 'Cartão vencido.';
      return '';
    },

    cvv() {
      const v = soDigitos($('#cvv').value);
      const b = detectarBandeira(soDigitos($('#numero').value));
      const esperado = b ? b.cvv : null;
      if (!v) return 'Informe o CVV.';
      if (esperado ? v.length !== esperado : (v.length < 3 || v.length > 4)) {
        return `O CVV deve ter ${esperado || '3 ou 4'} dígitos.`;
      }
      return '';
    }
  };

  function mostrarErro(campo, mensagem) {
    const input = $('#' + campo);
    const span = $('#erro-' + campo);
    input.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
    if (span) span.textContent = mensagem;
  }

  function validarCampo(campo) {
    const msg = validadores[campo]();
    mostrarErro(campo, msg);
    return !msg;
  }

  function validarCartao() {
    const campos = ['numero', 'nome', 'validade', 'cvv'];
    const invalidos = campos.filter(c => !validarCampo(c));
    if (invalidos.length) {
      $('#' + invalidos[0]).focus();
      return false;
    }
    return true;
  }

  /* ---------- Máscaras + prévia do cartão ---------- */
  function iniciarCartao() {
    const numero = $('#numero');
    const nome = $('#nome');
    const validade = $('#validade');
    const cvv = $('#cvv');
    const cartao3d = $('#cartao3d');

    numero.addEventListener('input', () => {
      const n = soDigitos(numero.value);
      const b = detectarBandeira(n);
      numero.value = formatarNumero(n, b);

      $('#pvNumero').textContent = numero.value || '•••• •••• •••• ••••';
      $('#pvBandeira').textContent = b ? b.nome : 'CARTÃO';

      // ajusta o tamanho máximo do CVV (Amex = 4)
      cvv.maxLength = b ? b.cvv : 4;
      if (numero.getAttribute('aria-invalid') === 'true') validarCampo('numero');
    });

    nome.addEventListener('input', () => {
      nome.value = semAcento(nome.value).toUpperCase().replace(/[^A-Z' ]/g, '');
      $('#pvNome').textContent = nome.value.trim() || 'NOME NO CARTÃO';
      if (nome.getAttribute('aria-invalid') === 'true') validarCampo('nome');
    });

    validade.addEventListener('input', () => {
      let d = soDigitos(validade.value).slice(0, 4);
      // mês começando com 2-9 vira 02-09 automaticamente
      if (d.length === 1 && Number(d) > 1) d = '0' + d;
      validade.value = d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
      $('#pvValidade').textContent = validade.value || 'MM/AA';
      if (validade.getAttribute('aria-invalid') === 'true') validarCampo('validade');
    });

    cvv.addEventListener('input', () => {
      cvv.value = soDigitos(cvv.value).slice(0, cvv.maxLength);
      $('#pvCvv').textContent = cvv.value ? '•'.repeat(cvv.value.length) : '•••';
      if (cvv.getAttribute('aria-invalid') === 'true') validarCampo('cvv');
    });

    // Vira o cartão ao digitar o CVV
    cvv.addEventListener('focus', () => cartao3d.classList.add('virado'));
    cvv.addEventListener('blur', () => cartao3d.classList.remove('virado'));

    // Valida ao sair do campo
    ['numero', 'nome', 'validade', 'cvv'].forEach(c => {
      $('#' + c).addEventListener('blur', () => {
        if ($('#' + c).value) validarCampo(c);
      });
    });
  }

  function limparCartao() {
    ['numero', 'nome', 'validade', 'cvv'].forEach(c => {
      $('#' + c).value = '';
      mostrarErro(c, '');
    });
    $('#pvNumero').textContent = '•••• •••• •••• ••••';
    $('#pvNome').textContent = 'NOME NO CARTÃO';
    $('#pvValidade').textContent = 'MM/AA';
    $('#pvCvv').textContent = '•••';
    $('#pvBandeira').textContent = 'CARTÃO';
  }

  /* ---------- Parcelas ---------- */
  function renderParcelas() {
    const select = $('#parcelas');
    const { total } = calcularTotais();
    const anterior = Number(select.value) || 1;

    const maximo = Math.max(1, Math.min(CONFIG.maxParcelas, Math.floor(total / CONFIG.parcelaMinima)));

    select.innerHTML = '';
    for (let i = 1; i <= maximo; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i === 1
        ? `1x de ${moeda.format(total)} (à vista)`
        : `${i}x de ${moeda.format(arredondar(total / i))} sem juros`;
      select.appendChild(opt);
    }
    select.value = String(Math.min(anterior, maximo));
  }

  /* =======================================================
     FINALIZAR PAGAMENTO
  ======================================================= */
  function finalizar(e) {
    e.preventDefault();
    if (estado.processando) return;

    if (estado.metodo === 'cartao') {
      if (!validarCartao()) return;
    } else if (estado.pixExpirado) {
      return toast('Esse código PIX expirou. Gere um novo.');
    }

    processarPagamento();
  }

  function processarPagamento() {
    estado.processando = true;

    const botao = $('#btnFinalizar');
    botao.disabled = true;
    botao.classList.add('carregando');
    botao.textContent = estado.metodo === 'pix' ? 'Confirmando PIX' : 'Processando pagamento';

    /* INTEGRAÇÃO: aqui entra a chamada ao seu backend/gateway, por exemplo:
       fetch('/api/pagamentos', { method: 'POST', body: JSON.stringify({...}) })
       Para cartão, envie o token gerado pelo gateway, nunca o número do cartão.
       Para PIX, o ideal é o servidor confirmar via webhook. */
    const atraso = estado.metodo === 'pix' ? 1200 : 2000;

    setTimeout(() => {
      const comprovante = montarComprovante();
      salvarComprovante(comprovante);

      clearInterval(estado.pixTimer);
      if (estado.metodo === 'cartao') limparCartao();

      botao.classList.remove('carregando');
      estado.processando = false;

      mostrarSucesso(comprovante);
    }, atraso);
  }

  function montarComprovante() {
    const { total } = calcularTotais();
    const numero = soDigitos($('#numero').value);
    const bandeira = detectarBandeira(numero);
    const parcelas = Number($('#parcelas').value) || 1;

    let forma = 'PIX';
    if (estado.metodo === 'cartao') {
      forma = `${bandeira ? bandeira.nome : 'Cartão'} •••• ${numero.slice(-4)} · ${parcelas}x`;
    }

    return {
      id: 'WN57-' + Date.now().toString(36).toUpperCase() +
        Math.random().toString(36).slice(2, 5).toUpperCase(),
      metodo: estado.metodo,
      forma,
      total,
      origem: estado.corrida.origem,
      destino: estado.corrida.destino,
      categoria: estado.corrida.categoria,
      data: new Date().toISOString(),
      status: 'pago'
    };
  }

  function salvarComprovante(comprovante) {
    try {
      const lista = JSON.parse(localStorage.getItem(CONFIG.chavePagamentos) || '[]');
      lista.unshift(comprovante);
      localStorage.setItem(CONFIG.chavePagamentos, JSON.stringify(lista.slice(0, 50)));
      localStorage.removeItem(CONFIG.chaveCorrida); // corrida já paga
    } catch {
      /* localStorage indisponível: segue sem salvar */
    }
  }

  function mostrarSucesso(c) {
    $('#cpId').textContent = c.id;
    $('#cpForma').textContent = c.forma;
    $('#cpValor').textContent = moeda.format(c.total);
    $('#cpData').textContent = new Date(c.data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });

    const modal = $('#modalSucesso');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#linkAtividade').focus();
  }

  /* =======================================================
     TOAST
  ======================================================= */
  function toast(texto) {
    const el = $('#toast');
    el.textContent = texto;
    el.classList.add('mostrar');
    clearTimeout(estado.toastTimer);
    estado.toastTimer = setTimeout(() => el.classList.remove('mostrar'), 2500);
  }

  /* =======================================================
     INICIALIZAÇÃO
  ======================================================= */
  function iniciar() {
    estado.corrida = carregarCorrida();

    // Métodos
    $$('.metodo').forEach(btn =>
      btn.addEventListener('click', () => selecionarMetodo(btn.dataset.metodo))
    );

    // PIX
    $('#btnCopiar').addEventListener('click', copiarPix);
    $('#btnNovoPix').addEventListener('click', () => {
      gerarPix();
      toast('Novo código PIX gerado.');
    });
    $('#pixCodigo').addEventListener('focus', e => e.target.select());

    // Cupom
    $('#btnCupom').addEventListener('click', aplicarCupom);
    $('#cupom').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        aplicarCupom();
      }
    });

    // Cartão
    iniciarCartao();

    // Envio
    $('#formPagamento').addEventListener('submit', finalizar);

    // Segurança: não deixa o Enter dentro dos campos do cartão enviar por engano
    // antes da validação (o submit já valida, mas evitamos duplo clique)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('#modalSucesso').hidden) {
        // o modal de sucesso não fecha com ESC de propósito: o pagamento já foi feito
        // e o usuário deve escolher um dos botões.
        e.preventDefault();
      }
    });

    renderResumo();
    gerarPix();
    selecionarMetodo('pix');
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();