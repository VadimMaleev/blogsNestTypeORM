import { Injectable } from "@nestjs/common";
import { CreateDeviceDto } from "../../types/dto";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Not, Repository } from "typeorm";
import { Device } from "./device.entity";

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Device) protected deviceRepository: Repository<Device>
  ) {}

  async createDevice(device: CreateDeviceDto) {
    await this.deviceRepository.save(device);
    return true;
  }

  async updateLastActiveDateByDeviceAndUserId(
    deviceId: string,
    userId: string,
    newLastActiveDate: string
  ): Promise<boolean> {
    await this.deviceRepository.update(
      { deviceId: deviceId, userId: userId },
      { lastActiveDate: newLastActiveDate }
    );
    return true;
  }

  async deleteDeviceByDeviceIdAndUserIdAndDate(
    userId: string,
    deviceId: string,
    lastActiveDate: Date
  ): Promise<boolean> {
    await this.deviceRepository.delete({
      deviceId: deviceId,
      userId: userId,
      lastActiveDate: lastActiveDate,
    });
    return true;
  }

  async deleteAllDevicesExceptCurrent(
    userId: string,
    deviceId: string
  ): Promise<boolean> {
    await this.deviceRepository.delete({
      userId: userId,
      deviceId: Not(deviceId),
    });
    return true;
  }

  async deleteDevice(deviceId: string): Promise<boolean> {
    await this.deviceRepository.delete({ deviceId: deviceId });
    return true;
  }

  async deleteDevicesForBannedUser(userId: string) {
    await this.deviceRepository.delete({ userId: userId });
    return true;
  }
}
