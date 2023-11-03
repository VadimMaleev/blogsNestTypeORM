import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { JWTService } from "../repositories/jwt/jwt.service";
import { Request } from "express";
import { JwtRepository } from "../repositories/jwt/jwt.repository";
import { UsersRepository } from "../repositories/users/users.repo";
import { DevicesQueryRepository } from "../repositories/devices/devices.query.repository";

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(
    protected usersRepository: UsersRepository,
    protected jwtService: JWTService,
    protected jwtRepository: JwtRepository,
    protected devicesRepository: DevicesQueryRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const refreshTokenFromCookie = req.cookies.refreshToken;
    if (!refreshTokenFromCookie) throw new UnauthorizedException();

    const payload = await this.jwtService.extractPayloadFromToken(
      refreshTokenFromCookie
    );
    if (!payload) throw new UnauthorizedException();

    const deviceId = payload.deviceId;
    if (!deviceId) throw new UnauthorizedException();
    const device = await this.devicesRepository.findDeviceByDeviceId(deviceId);
    if (!device) throw new UnauthorizedException();

    const lastActiveDateFromToken =
      this.jwtService.getLastActiveDateFromRefreshToken(refreshTokenFromCookie);
    if (lastActiveDateFromToken !== device.lastActiveDate.toISOString())
      throw new UnauthorizedException();
    // const refreshTokenIsBlack = await this.jwtRepository.findAllExpiredTokens(
    //   refreshTokenFromCookie
    // );
    // if (refreshTokenIsBlack) throw new UnauthorizedException();
    const user = await this.usersRepository.findUserById(payload.userId);
    if (!user) throw new UnauthorizedException();
    req.user = user;
    return true;
  }
}
