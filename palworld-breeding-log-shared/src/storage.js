import { supabase } from "./supabaseClient";

const TABLE = "kv_store";

async function get(key) {
  const { data, error } = await supabase.from(TABLE).select("value").eq("key", key).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { key, value: data.value, shared: true };
}

async function set(key, value) {
  const { error } = await supabase.from(TABLE).upsert({ key, value });
  if (error) {
    console.error("storage.set error:", error);
    return null;
  }
  return { key, value, shared: true };
}

async function del(key) {
  const { error } = await supabase.from(TABLE).delete().eq("key", key);
  if (error) return null;
  return { key, deleted: true, shared: true };
}

async function list(prefix) {
  let query = supabase.from(TABLE).select("key");
  if (prefix) query = query.like("key", `${prefix}%`);
  const { data, error } = await query;
  if (error) return null;
  return { keys: (data || []).map((r) => r.key), prefix, shared: true };
}

// このアプリ全体で使う window.storage を、Supabase経由の実装に差し替える
window.storage = { get, set, delete: del, list };
