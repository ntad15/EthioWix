import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type DomainSource = "REGISTERED" | "EXTERNAL";
export type DomainStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "FAILED";
export type OrderKind = "INITIAL" | "RENEWAL";
export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "REGISTERED" | "REFUNDED" | "FAILED";

export type Domain = {
  id: string;
  name: string;
  tld: string;
  siteId: string | null;
  userId: string;
  source: DomainSource;
  status: DomainStatus;
  registeredAt: string | null;
  expiresAt: string | null;
  autoRenew: boolean;
  porkbunOrderId: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  ownerPhone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DomainOrder = {
  id: string;
  domainId: string | null;
  userId: string;
  domainName: string;
  tld: string;
  priceBirr: number;
  years: number;
  kind: OrderKind;
  status: OrderStatus;
  chapaTxRef: string;
  chapaChargeId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentMethod = {
  id: string;
  userId: string;
  chapaCustomerId: string;
  cardLast4: string | null;
  createdAt: string;
  updatedAt: string;
};

type Row = Record<string, unknown>;

function rowToDomain(row: Row): Domain {
  return {
    id: row.id as string,
    name: row.name as string,
    tld: row.tld as string,
    siteId: (row.site_id as string | null) ?? null,
    userId: row.user_id as string,
    source: row.source as DomainSource,
    status: row.status as DomainStatus,
    registeredAt: (row.registered_at as string | null) ?? null,
    expiresAt: (row.expires_at as string | null) ?? null,
    autoRenew: row.auto_renew as boolean,
    porkbunOrderId: (row.porkbun_order_id as string | null) ?? null,
    ownerName: (row.owner_name as string | null) ?? null,
    ownerEmail: (row.owner_email as string | null) ?? null,
    ownerPhone: (row.owner_phone as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToOrder(row: Row): DomainOrder {
  return {
    id: row.id as string,
    domainId: (row.domain_id as string | null) ?? null,
    userId: row.user_id as string,
    domainName: row.domain_name as string,
    tld: row.tld as string,
    priceBirr: row.price_birr as number,
    years: row.years as number,
    kind: row.kind as OrderKind,
    status: row.status as OrderStatus,
    chapaTxRef: row.chapa_tx_ref as string,
    chapaChargeId: (row.chapa_charge_id as string | null) ?? null,
    failureReason: (row.failure_reason as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToPaymentMethod(row: Row): PaymentMethod {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    chapaCustomerId: row.chapa_customer_id as string,
    cardLast4: (row.card_last4 as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

type Client = SupabaseClient;

async function userClient(): Promise<Client> {
  return (await createClient()) as unknown as Client;
}

function adminClient(): Client {
  return createAdminClient();
}

// === Domain reads ===

export async function getDomainById(id: string): Promise<Domain | null> {
  const sb = await userClient();
  const { data, error } = await sb.from("domains").select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") throw error;
  return data ? rowToDomain(data) : null;
}

export async function getDomainByName(name: string): Promise<Domain | null> {
  const sb = adminClient();
  const { data, error } = await sb.from("domains").select("*").eq("name", name).maybeSingle();
  if (error) throw error;
  return data ? rowToDomain(data) : null;
}

export async function getDomainsByUserId(userId: string): Promise<Domain[]> {
  const sb = await userClient();
  const { data, error } = await sb
    .from("domains")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToDomain);
}

export async function getActiveDomainByName(name: string): Promise<Domain | null> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("domains")
    .select("*")
    .eq("name", name)
    .eq("status", "ACTIVE")
    .maybeSingle();
  if (error) throw error;
  return data ? rowToDomain(data) : null;
}

export async function findActiveDomainByHost(host: string): Promise<Domain | null> {
  const apex = host.toLowerCase().replace(/^www\./, "").split(":")[0];
  const sb = adminClient();
  const { data, error } = await sb
    .from("domains")
    .select("*")
    .eq("status", "ACTIVE")
    .in("name", [host.toLowerCase(), apex])
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToDomain(data) : null;
}

export async function listDomainsBySite(
  siteId: string,
  userId: string
): Promise<Domain[]> {
  const sb = await userClient();
  const { data, error } = await sb
    .from("domains")
    .select("*")
    .eq("site_id", siteId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToDomain);
}

export async function listOrdersBySite(
  siteId: string,
  userId: string
): Promise<DomainOrder[]> {
  const sb = adminClient();
  const { data: domainRows, error: dErr } = await sb
    .from("domains")
    .select("id")
    .eq("site_id", siteId)
    .eq("user_id", userId);
  if (dErr) throw dErr;
  const domainIds = (domainRows ?? []).map((r) => r.id as string);
  if (domainIds.length === 0) return [];
  const { data, error } = await sb
    .from("domain_orders")
    .select("*")
    .eq("user_id", userId)
    .in("domain_id", domainIds)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToOrder);
}

export async function listExpiringRegisteredDomains(beforeIso: string): Promise<Domain[]> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("domains")
    .select("*")
    .eq("source", "REGISTERED")
    .eq("status", "ACTIVE")
    .eq("auto_renew", true)
    .lte("expires_at", beforeIso);
  if (error) throw error;
  return (data ?? []).map(rowToDomain);
}

// === Domain writes ===

export type CreateDomainInput = {
  id?: string;
  name: string;
  tld: string;
  siteId?: string | null;
  userId: string;
  source: DomainSource;
  status: DomainStatus;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerPhone?: string | null;
};

export async function createDomain(
  input: CreateDomainInput,
  opts: { admin?: boolean } = {}
): Promise<Domain> {
  const sb = opts.admin ? adminClient() : await userClient();
  const id = input.id ?? crypto.randomUUID();
  const { data, error } = await sb
    .from("domains")
    .insert({
      id,
      name: input.name,
      tld: input.tld,
      site_id: input.siteId ?? null,
      user_id: input.userId,
      source: input.source,
      status: input.status,
      owner_name: input.ownerName ?? null,
      owner_email: input.ownerEmail ?? null,
      owner_phone: input.ownerPhone ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToDomain(data);
}

export type UpdateDomainPatch = Partial<{
  siteId: string | null;
  status: DomainStatus;
  registeredAt: Date | string | null;
  expiresAt: Date | string | null;
  autoRenew: boolean;
  porkbunOrderId: string | null;
}>;

export async function updateDomain(
  id: string,
  patch: UpdateDomainPatch,
  opts: { admin?: boolean } = {}
): Promise<Domain> {
  const sb = opts.admin ? adminClient() : await userClient();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.siteId !== undefined) update.site_id = patch.siteId;
  if (patch.status !== undefined) update.status = patch.status;
  if (patch.registeredAt !== undefined)
    update.registered_at =
      patch.registeredAt instanceof Date ? patch.registeredAt.toISOString() : patch.registeredAt;
  if (patch.expiresAt !== undefined)
    update.expires_at =
      patch.expiresAt instanceof Date ? patch.expiresAt.toISOString() : patch.expiresAt;
  if (patch.autoRenew !== undefined) update.auto_renew = patch.autoRenew;
  if (patch.porkbunOrderId !== undefined) update.porkbun_order_id = patch.porkbunOrderId;

  const { data, error } = await sb.from("domains").update(update).eq("id", id).select().single();
  if (error) throw error;
  return rowToDomain(data);
}

// === Order reads ===

export async function getDomainOrderById(id: string): Promise<DomainOrder | null> {
  const sb = adminClient();
  const { data, error } = await sb.from("domain_orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToOrder(data) : null;
}

export async function getDomainOrderByTxRef(txRef: string): Promise<DomainOrder | null> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("domain_orders")
    .select("*")
    .eq("chapa_tx_ref", txRef)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToOrder(data) : null;
}

export async function countFailedRenewalOrders(domainId: string): Promise<number> {
  const sb = adminClient();
  const { count, error } = await sb
    .from("domain_orders")
    .select("*", { count: "exact", head: true })
    .eq("domain_id", domainId)
    .eq("kind", "RENEWAL")
    .eq("status", "FAILED");
  if (error) throw error;
  return count ?? 0;
}

// === Order writes ===

export type CreateOrderInput = {
  id?: string;
  domainId?: string | null;
  userId: string;
  domainName: string;
  tld: string;
  priceBirr: number;
  years?: number;
  kind: OrderKind;
  status: OrderStatus;
  chapaTxRef: string;
};

export async function createDomainOrder(
  input: CreateOrderInput,
  opts: { admin?: boolean } = {}
): Promise<DomainOrder> {
  const sb = opts.admin ? adminClient() : await userClient();
  const id = input.id ?? crypto.randomUUID();
  const { data, error } = await sb
    .from("domain_orders")
    .insert({
      id,
      domain_id: input.domainId ?? null,
      user_id: input.userId,
      domain_name: input.domainName,
      tld: input.tld,
      price_birr: input.priceBirr,
      years: input.years ?? 1,
      kind: input.kind,
      status: input.status,
      chapa_tx_ref: input.chapaTxRef,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToOrder(data);
}

export type UpdateOrderPatch = Partial<{
  domainId: string | null;
  status: OrderStatus;
  chapaChargeId: string | null;
  failureReason: string | null;
}>;

export async function updateDomainOrder(
  id: string,
  patch: UpdateOrderPatch,
  opts: { admin?: boolean } = {}
): Promise<DomainOrder> {
  const sb = opts.admin ? adminClient() : await userClient();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.domainId !== undefined) update.domain_id = patch.domainId;
  if (patch.status !== undefined) update.status = patch.status;
  if (patch.chapaChargeId !== undefined) update.chapa_charge_id = patch.chapaChargeId;
  if (patch.failureReason !== undefined) update.failure_reason = patch.failureReason;

  const { data, error } = await sb
    .from("domain_orders")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return rowToOrder(data);
}

// === Payment methods ===

export async function getPaymentMethodByUserId(userId: string): Promise<PaymentMethod | null> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("payment_methods")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToPaymentMethod(data) : null;
}
