import apiClient from "../../../services/ApiClient";
import type { Address, AddressPayload } from "../types";

const PREFIX = "/user/addresses";

class AddressService {
  async list(): Promise<Address[]> {
    const res: any = await apiClient.get(PREFIX);
    return res?.data ?? res;
  }

  async create(payload: AddressPayload): Promise<Address> {
    const res: any = await apiClient.post(PREFIX, payload);
    return res?.data ?? res;
  }

  async update(id: string, payload: AddressPayload): Promise<Address> {
    const res: any = await apiClient.put(`${PREFIX}/${id}`, payload);
    return res?.data ?? res;
  }

  async setDefault(id: string): Promise<Address> {
    const res: any = await apiClient.post(`${PREFIX}/${id}/default`, {});
    return res?.data ?? res;
  }

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${PREFIX}/${id}`);
  }
}

export default new AddressService();
