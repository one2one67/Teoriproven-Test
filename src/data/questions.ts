export * from "./q_base";
import { CategoryId } from "./q_base";
import { varebilData } from "./q_varebil";
import { taxiData } from "./q_taxi";
import { drosjeData } from "./q_drosje";
import { lastebilData } from "./q_lastebil";
import { personbilBData } from "./q_personbil_b";
import { personbilB96Data } from "./q_personbil_b96";
import { personbilBEData } from "./q_personbil_be";

export const QDATA: Record<CategoryId, { themes: any, q: any[] }> = {
  varebil: varebilData,
  taxi: taxiData,
  drosje: drosjeData,
  lastebil: lastebilData,
  personbil_b: personbilBData,
  personbil_b96: personbilB96Data,
  personbil_be: personbilBEData
};
