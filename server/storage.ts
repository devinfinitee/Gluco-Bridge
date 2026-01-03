import { db } from "./db";
import {
  screenings,
  type InsertScreening,
  type Screening
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createScreening(screening: InsertScreening): Promise<Screening>;
  getScreening(id: number): Promise<Screening | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createScreening(insertScreening: InsertScreening): Promise<Screening> {
    const [screening] = await db
      .insert(screenings)
      .values(insertScreening)
      .returning();
    return screening;
  }

  async getScreening(id: number): Promise<Screening | undefined> {
    const [screening] = await db
      .select()
      .from(screenings)
      .where(eq(screenings.id, id));
    return screening;
  }
}

export const storage = new DatabaseStorage();
