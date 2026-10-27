import { Page, expect } from '@playwright/test';
import BasePage from './BasePage';

export default class YoutubePage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  async acessarHome(): Promise<void> {
    await this.page.goto('https://www.youtube.com/', {
      waitUntil: 'domcontentloaded'
    });
    await this.aceitarCookiesSePresente();
  }

  private async aceitarCookiesSePresente(): Promise<void> {
    const botoesConsentimento = [
      'button:has-text("Aceitar tudo")',
      'button:has-text("Concordo")',
      'button:has-text("Accept all")',
      'button:has-text("I agree")',
      'form[action*="consent"] button'
    ];

    for (const seletor of botoesConsentimento) {
      const botao = this.page.locator(seletor).first();
      if (await botao.isVisible({ timeout: 3000 }).catch(() => false)) {
        await botao.click();
        await this.page.waitForTimeout(1000);
        break;
      }
    }
  }

  async pesquisarTermo(termo: string): Promise<void> {
    const searchInput = this.page.getByRole('combobox', { name: /Pesquisar|Search/i });
    await expect(searchInput).toBeVisible();
    await searchInput.fill(termo);
    await searchInput.press('Enter');
  }

  async validarResultadosBusca(): Promise<void> {
    const videoResults = this.page.locator('ytd-video-renderer, ytd-rich-item-renderer').first();
    await expect(videoResults).toBeVisible({ timeout: 20000 });
  }

  async clicarPrimeiroVideo(): Promise<void> {
    const videoTitulo = this.page
      .locator('ytd-video-renderer')
      .filter({ hasNotText: /Patrocinado|Sponsored/i })
      .locator('#video-title')
      .first();

    await videoTitulo.click({ force: true });
  }

  async validarPaginaReproducao(): Promise<void> {
    await expect(this.page).toHaveURL(/\/watch\?v=/);
    const videoPlayer = this.page.locator('#movie_player').first();
    await expect(videoPlayer).toBeVisible({ timeout: 20000 });
  }

  async aplicarFiltroBusca(filtroNome: string): Promise<void> {
    const filterButton = this.page.getByRole('button', { name: /Filtros|Filters/i });
    await expect(filterButton).toBeVisible();
    await filterButton.click();

    // Regex flexível (case-insensitive e substring) para aceitar "Canal" dentro de "Canais"
    const option = this.page.locator('yt-formatted-string, tp-yt-paper-item, span, div').filter({ hasText: new RegExp(filtroNome, 'i') }).first();
    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click({ force: true });

    // Fecha o modal de filtros
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
  }

  async abrirMenuLateral(): Promise<void> {
    const menuButton = this.page.getByRole('button', { name: /Guia|Guide|Menu/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
  }

  async navegarParaSecao(nomeSecao: string): Promise<void> {
    const secaoLink = this.page.getByRole('link', { name: new RegExp(nomeSecao, 'i') }).first();
    await expect(secaoLink).toBeVisible();
    await secaoLink.click();

    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(800);
  }

  async rolarAteComentarios(): Promise<void> {
    const secaoComentarios = this.page.locator('#comments, ytd-comments').first();
    await secaoComentarios.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000); 
  }

  async validarSecaoComentarios(): Promise<void> {
    const secaoComentarios = this.page.locator('#comments, ytd-comments').first();
    await expect(secaoComentarios).toBeVisible({ timeout: 20000 });
  }

  async pausarVideoPeloPlayer(): Promise<void> {
    const player = this.page.locator('#movie_player').first();
    await player.hover();
    const playButton = this.page.locator('.ytp-play-button').first();
    if (await playButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await playButton.click();
    }
  }

  async validarPlayerInteragido(): Promise<void> {
    const playerContainer = this.page.locator('#movie_player').first();
    await expect(playerContainer).toBeVisible();
  }

  async voltarPaginaHistorico(): Promise<void> {
    await this.page.goBack();
  }

  async validarMetadadosCompletosVideo(): Promise<void> {
    const titulo = this.page.locator('h1.ytd-watch-metadata').first();
    const canal = this.page.locator('#upload-info #channel-name a').first();
    const botaoInscrever = this.page.locator('ytd-subscribe-button-renderer').first();

    await expect(titulo).toBeVisible({ timeout: 15000 });
    await expect(canal).toBeVisible({ timeout: 15000 });
    await expect(botaoInscrever).toBeVisible({ timeout: 15000 });
  }

  async aguardarReproducao(segundos: number): Promise<void> {
    await this.page.waitForTimeout(segundos * 1000);
  }

  async limparBarraPesquisa(): Promise<void> {
    const searchInput = this.page.getByRole('combobox', { name: /Pesquisar|Search/i });
    await expect(searchInput).toBeVisible();
    await searchInput.clear();
  }

  async validarResultadosCanalBusca(): Promise<void> {
    const channelResults = this.page.locator('ytd-channel-renderer').first();
    await expect(channelResults).toBeVisible({ timeout: 20000 });
  }
}