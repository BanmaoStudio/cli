import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import api from "./service";

export function setupMockServer() {
  createProdMockServer(api);
}
