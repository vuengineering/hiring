import { CaseApi, ImageApi, ResultApi } from "./api/generated";
import { LoaderFunction } from "react-router-dom";

export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<
  ReturnType<TLoaderFn>
> extends Response | infer D
  ? D
  : never;

function getBaseUrl() {
  const baseUrl = document.getElementById("baseUrl")?.innerText;
  // if baseUrl is not set, we are in local mode
  return baseUrl?.startsWith("{{") ? "http://localhost:8000" : baseUrl;
}

export const caseClient = new CaseApi(undefined, getBaseUrl());
export const imageClient = new ImageApi(undefined, getBaseUrl());
export const resultClient = new ResultApi(undefined, getBaseUrl());
