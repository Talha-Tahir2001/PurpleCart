import type { Request } from "express";

export type AuthenticatedRequest<TBody = unknown> = Request<{}, {}, TBody> & {
  userId?: string;
};