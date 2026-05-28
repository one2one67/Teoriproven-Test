export * from "./q_base";
import { CategoryId } from "./q_base";
import { varebilData } from "./q_varebil";
import { taxiData } from "./q_taxi";
import { drosjeData } from "./q_drosje";
import { lastebilData } from "./q_lastebil";

export const QDATA: Record<CategoryId, { themes: any, q: any[] }> = {
  varebil: varebilData,
  taxi: taxiData,
  drosje: drosjeData,
  lastebil: lastebilData
};
