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
  it("hace fallback a es si falta la clave en en", () => {
    const t = useTranslations("en");
    expect(typeof t("nav.donate")).toBe("string");
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
