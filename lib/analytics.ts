/**
 * Telemetria desligada. O Citiesoft traz PostHog e atribuição de afiliado junto de alguns
 * blocos; o Design System da Citiesoft não envia evento nenhum, então `track` não faz nada.
 */
export function track(_event: string, _props?: Record<string, unknown>): void {}
