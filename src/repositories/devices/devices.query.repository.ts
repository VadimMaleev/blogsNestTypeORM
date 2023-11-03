import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Device } from "./device.entity";

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectRepository(Device) protected deviceRepository: Repository<Device>
  ) {}

  async findDevicesForUser(userId: string): Promise<Device> {
    return await this.deviceRepository.findOneBy({ userId: userId });
  }

  async findDeviceByDeviceIdAndUserIdAndDate(
    deviceId: string,
    userId: string,
    lastActiveDate: Date
  ): Promise<Device> {
    return await this.deviceRepository.findOneBy({
      deviceId: deviceId,
      userId: userId,
      lastActiveDate: lastActiveDate,
    });
  }

  async findDeviceByDeviceId(deviceId: string): Promise<Device> {
    return await this.deviceRepository.findOneBy({ deviceId: deviceId });
  }
}
