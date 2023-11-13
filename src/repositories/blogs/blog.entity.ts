import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("Blog")
export class Blog {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  isMembership: boolean;

  @Column()
  isBanned: boolean;

  @Column({ type: "timestamp with time zone", nullable: true })
  banDate: Date;
}
