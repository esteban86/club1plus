import { describe, expect, it } from "vitest";
import { getLangFromUrl, useTranslations, getRoute, otherLang } from "../src/i18n/utils";

describe("i18n utils", () => {
  it("detecta es por defecto en la raíz", () => {
    expect(getLangFromUrl(new URL("https://x.io/club1plus/"))).toBe("es");
  });
  it("detecta en bajo /en", () => {
    expect(getLangFromUrl(new URL("https://x.io/club1plus/en/model"))).toBe("en");
  });
  it("traduce una clave conocida", () => {
    const t = useTranslations("es");
    expect(t("nav.donate")).toBe("Sé socio");
  });
  it("una clave conocida en en devuelve su valor en inglés (no el español)", () => {
    const t = useTranslations("en");
    expect(t("nav.donate")).toBe("Become a member");
  });
  it("una clave inexistente cae al propio key (último fallback)", () => {
    const t = useTranslations("en");
    expect(t("clave.inexistente")).toBe("clave.inexistente");
  });
  it("resuelve la ruta de una página por idioma", () => {
    expect(getRoute("modelo", "es")).toBe("/modelo");
    expect(getRoute("modelo", "en")).toBe("/en/model");
  });
  it("otherLang invierte el idioma", () => {
    expect(otherLang("es")).toBe("en");
    expect(otherLang("en")).toBe("es");
  });
});
