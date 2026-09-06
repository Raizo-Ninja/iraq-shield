// ============================================================
//  IRAQ SHIELD — إعدادات Supabase / Supabase configuration
// ============================================================
//  ضع هنا القيمتين من لوحة Supabase:
//  Project Settings ▸ Data API  →  Project URL
//  Project Settings ▸ API Keys  →  publishable key (يبدأ بـ sb_publishable_)
//
//  Paste the two values from your Supabase dashboard:
//  Project Settings ▸ Data API  →  Project URL
//  Project Settings ▸ API Keys  →  publishable key (starts with sb_publishable_)
//
//  ⚠ المفتاح العام (publishable) آمن للنشر — لا تضع هنا مفتاح service_role أبدًا.
//  ⚠ The publishable key is safe to expose — NEVER put the service_role key here.
// ============================================================

window.IQS_SUPABASE = {
  url:     "https://YOUR-PROJECT-ID.supabase.co",
  anonKey: "sb_publishable_XXXXXXXXXXXXXXXXXXXXXXXX"
};
