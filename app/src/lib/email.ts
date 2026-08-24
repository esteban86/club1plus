// Interfaz reemplazable: la lógica de auth depende de EmailSender, nunca de
// Resend directamente. Así se puede probar/desarrollar sin cuenta de Resend
// y conectar la implementación real el día que exista RESEND_API_KEY.
export interface EmailSender {
  sendMagicLink(to: string, magicLinkUrl: string): Promise<void>;
}

export class ResendEmailSender implements EmailSender {
  constructor(
    private readonly apiKey: string,
    private readonly from = "El Club del 1+ <hola@clubdel1.org>",
  ) {}

  async sendMagicLink(to: string, magicLinkUrl: string): Promise<void> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: [to],
        subject: "Tu enlace de acceso — El Club del 1+",
        html: `<p>Entra a tu espacio de socio con este enlace (válido 15 minutos):</p><p><a href="${magicLinkUrl}">${magicLinkUrl}</a></p><p>Si no lo pediste tú, ignora este correo.</p>`,
      }),
    });
    if (!res.ok) {
      throw new Error(`Resend respondió ${res.status}: ${await res.text()}`);
    }
  }
}

/** Stub para dev/tests: no envía nada real, solo registra. */
export class ConsoleEmailSender implements EmailSender {
  async sendMagicLink(to: string, magicLinkUrl: string): Promise<void> {
    console.log(JSON.stringify({ msg: "magic_link_dev", to, magicLinkUrl }));
  }
}
