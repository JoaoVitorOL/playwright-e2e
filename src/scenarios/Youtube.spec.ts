import { test, expect } from '@playwright/test';
import YoutubePage from '../support/pages/YoutubePage';

test.describe('YouTube E2E - Testes Funcionais e Jornadas do Usuário', () => {
  let youtubePage: YoutubePage;

  test.beforeEach(async ({ page }) => {
    youtubePage = new YoutubePage(page);
    await youtubePage.acessarHome();
  });

  // 1. Core de Busca e Reprodução
  test('Deve buscar por um tutorial rápido de Playwright, reproduzir o vídeo e aguardar apenas 6 segundos', async () => {
    const termoBusca = 'Playwright in 5 minutes tutorial';

    await youtubePage.pesquisarTermo(termoBusca);
    await youtubePage.validarResultadosBusca();

    await youtubePage.clicarPrimeiroVideo();
    await youtubePage.validarPaginaReproducao();
    
    await youtubePage.aguardarReproducao(6);
  });

  // 2. Filtros de Pesquisa
  test('Deve refinar os resultados de pesquisa utilizando o painel de filtros por período de envio', async () => {
    const termoBusca = 'TypeScript tutorial';

    await youtubePage.pesquisarTermo(termoBusca);
    await youtubePage.validarResultadosBusca();

    await youtubePage.aplicarFiltroBusca('Este mês');
    await youtubePage.validarResultadosBusca();
  });

  // 3. Navegação SPA (Menu Lateral / Shorts)
  test('Deve navegar pelo menu lateral de navegação (Guide) para a seção do Shorts e validar os elementos', async () => {
    await youtubePage.abrirMenuLateral();
    await youtubePage.navegarParaSecao('Shorts');

    await youtubePage.page.waitForURL(/\/shorts/);
    const shortsContainer = youtubePage.page.locator('ytd-reel-vector-renderer, ytd-reel-video-renderer, ytd-shorts').first();
    await expect(shortsContainer).toBeVisible({ timeout: 15000 });
  });

  // 4. Scroll e Lazy Loading de Comentários
  test('Deve rolar a página de reprodução até a seção de comentários e validar o carregamento assíncrono', async () => {
    await youtubePage.pesquisarTermo('JavaScript course');
    await youtubePage.validarResultadosBusca();
    await youtubePage.clicarPrimeiroVideo();
    await youtubePage.validarPaginaReproducao();

    await youtubePage.rolarAteComentarios();
    await youtubePage.validarSecaoComentarios();
  });

  // 5. Controles do Player de Vídeo
  test('Deve interagir com os controles flutuantes do player de vídeo (pausar/reproduzir) na página de watch', async () => {
    await youtubePage.pesquisarTermo('Node.js tutorial');
    await youtubePage.validarResultadosBusca();
    await youtubePage.clicarPrimeiroVideo();
    await youtubePage.validarPaginaReproducao();

    await youtubePage.pausarVideoPeloPlayer();
    await youtubePage.validarPlayerInteragido();
  });

  // 6. Histórico de Navegação (Voltar/Avançar do Browser)
  test('Deve preservar o estado da listagem de busca ao utilizar o botão de voltar do navegador a partir da página de watch', async () => {
    const termoBusca = 'Playwright test history';

    await youtubePage.pesquisarTermo(termoBusca);
    await youtubePage.validarResultadosBusca();

    await youtubePage.clicarPrimeiroVideo();
    await youtubePage.validarPaginaReproducao();

    await youtubePage.voltarPaginaHistorico();
    await youtubePage.validarResultadosBusca();
  });

  // 7. Validação de Metadados e Elementos do Vídeo na Watch Page (Core Estável)
  test('Deve validar o carregamento completo do título, nome do canal e botão de inscrição na página de reprodução', async () => {
    await youtubePage.pesquisarTermo('React JS tutorial');
    await youtubePage.validarResultadosBusca();
    await youtubePage.clicarPrimeiroVideo();
    await youtubePage.validarPaginaReproducao();
    
    await youtubePage.validarMetadadosCompletosVideo();
  });

  // 8. Teste Funcional: Filtrar Pesquisa por Tipo de Canal
  test('Deve refinar os resultados de pesquisa aplicando o filtro por tipo de Canal e validar a listagem', async () => {
    const termoBusca = 'Fireship';

    await youtubePage.pesquisarTermo(termoBusca);
    await youtubePage.validarResultadosBusca();

    await youtubePage.aplicarFiltroBusca('Canal');
    await youtubePage.validarResultadosCanalBusca();
  });

  // 9. Navegação SPA para a Seção de Inscrições (Subscriptions)
  test('Deve navegar para a seção de Inscrições utilizando o menu lateral retrátil', async () => {
    await youtubePage.abrirMenuLateral();
    await youtubePage.navegarParaSecao('Inscrições');
    await youtubePage.page.waitForURL(/\/feed\/subscriptions/);
  });

  // 10. Interação e Limpeza de Termo na Barra de Pesquisa Principal
  test('Deve permitir preencher, limpar e efetuar uma nova pesquisa diretamente na barra superior', async () => {
    await youtubePage.pesquisarTermo('Angular 2026');
    await youtubePage.validarResultadosBusca();
    await youtubePage.limparBarraPesquisa();
  });
});