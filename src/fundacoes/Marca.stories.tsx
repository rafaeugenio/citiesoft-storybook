import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import './Fundacoes.css';
import './Marca.css';

/**
 * Marca (brandbook/03-visual-identity/logo-backgrounds.md v1.0.0).
 * A versão do logo é determinada pelo fundo, nunca o contrário. O logo nunca é
 * recolorido, invertido, distorcido ou adaptado à mão.
 */

const meta = {
  title: 'Fundações/Marca',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Aplicação do logo Citiesoft por tipo de fundo. Fonte: `brandbook/03-visual-identity/logo-backgrounds.md`. Os arquivos vêm do pacote oficial em `brandbook/assets/logos/`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LogoPorFundo: Story = {
  name: 'Logo por fundo',
  render: () => (
    <div className="marca">
      <figure className="marca__caso marca__caso--claro">
        <img src="/marca/LogoHorizontal3.svg" alt="Logo Citiesoft" width="200" />
        <figcaption>
          <strong>Fundo claro ou branco</strong>
          <span>LogoHorizontal3.svg</span>
          <span className="marca__nota">#FAFAFA, #FFFFFF e cinzas 50 a 200</span>
        </figcaption>
      </figure>

      <figure className="marca__caso marca__caso--azul">
        <img src="/marca/LogoHorizontal2.svg" alt="Logo Citiesoft" width="200" />
        <figcaption>
          <strong>Fundo azul ou escuro</strong>
          <span>LogoHorizontal2.svg</span>
          <span className="marca__nota">Citie Blue 400 a 950, #202020 e cinzas 700 a 900</span>
        </figcaption>
      </figure>

      <figure className="marca__caso marca__caso--gradiente">
        <img src="/marca/LogoHorizontal2.svg" alt="Logo Citiesoft" width="200" />
        <figcaption>
          <strong>Gradiente de marca</strong>
          <span>LogoHorizontal2.svg</span>
          <span className="marca__nota">O gradiente conta como fundo escuro</span>
        </figcaption>
      </figure>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const logos = canvas.getAllByRole('img', { name: 'Logo Citiesoft' });

    await expect(logos).toHaveLength(3);
    // A regra de fundo é a que define o arquivo.
    await expect(logos[0]).toHaveAttribute('src', '/marca/LogoHorizontal3.svg');
    await expect(logos[1]).toHaveAttribute('src', '/marca/LogoHorizontal2.svg');
  },
};

export const SimboloIsolado: Story = {
  name: 'Símbolo isolado',
  render: () => (
    <div className="marca">
      <figure className="marca__caso marca__caso--claro">
        <img src="/marca/LogoAzul.svg" alt="Símbolo Citiesoft" width="64" />
        <figcaption>
          <strong>Fundo claro</strong>
          <span>LogoAzul.svg</span>
        </figcaption>
      </figure>

      <figure className="marca__caso marca__caso--azul">
        <img src="/marca/LogoBranca.svg" alt="Símbolo Citiesoft" width="64" />
        <figcaption>
          <strong>Fundo escuro ou azul</strong>
          <span>LogoBranca.svg</span>
        </figcaption>
      </figure>
    </div>
  ),
};

export const AntiPadraoLogo: Story = {
  name: 'Anti-padrão · versão errada e recolorida',
  tags: ['anti-padrao'],
  parameters: {
    docs: {
      description: {
        story:
          'Errado de propósito. À esquerda, a versão de fundo claro aplicada sobre azul, que perde contraste. À direita, o logo recolorido por CSS, proibido pelo brandbook: a versão correta do arquivo já carrega as cores adequadas.',
      },
    },
  },
  render: () => (
    <div className="marca">
      <figure className="marca__caso marca__caso--azul marca__caso--errado">
        <img src="/marca/LogoHorizontal3.svg" alt="Logo Citiesoft aplicado incorretamente" width="200" />
        <figcaption>
          <strong>Versão de fundo claro sobre azul</strong>
          <span className="marca__nota">Contraste abaixo do mínimo de 4,5:1</span>
        </figcaption>
      </figure>

      <figure className="marca__caso marca__caso--claro marca__caso--errado">
        <img
          src="/marca/LogoHorizontal3.svg"
          alt="Logo Citiesoft recolorido incorretamente"
          width="200"
          className="marca__recolorido"
        />
        <figcaption>
          <strong>Logo recolorido por CSS</strong>
          <span className="marca__nota">Proibido alterar cor por filtro, fill ou efeito</span>
        </figcaption>
      </figure>
    </div>
  ),
};
