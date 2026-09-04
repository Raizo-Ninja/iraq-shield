<div align="center">

# 🛡️ IRAQ SHIELD

**مركز عمليات سيبرانية تفاعلي على خريطة العراق — Cyber Operations Center on the map of Iraq**

[![Live site](https://img.shields.io/badge/live-iraq--shield.com-22D3EE?style=flat-square)](https://iraq-shield.com)
[![Data collector](https://github.com/Raizo-Ninja/iraq-shield/actions/workflows/collect.yml/badge.svg)](https://github.com/Raizo-Ninja/iraq-shield/actions/workflows/collect.yml)
![Static site](https://img.shields.io/badge/stack-HTML%20%2B%20SVG%20%2B%20JS-0B1424?style=flat-square)

</div>

---

## ما هو المشروع؟ | What is it?

**Iraq Shield** لوحة SOC تعرض الهجمات السيبرانية الموجَّهة نحو العراق على خريطة المحافظات الثمانية عشر، مع مصدر الهجوم، ونوعه، والهدف، وحالة الاستجابة (صُدّ / اختراق / قيد التحقيق) وتسلسل زمني لكل حادث.

**Iraq Shield** is a SOC-style dashboard that visualises cyber attacks targeting Iraq on a province-level map — attack origin, type, target, response status (blocked / breached / investigating) and a per-incident timeline.

## البنية | Structure

| المسار | الوصف |
|---|---|
| `index.html` | الموقع كاملًا في ملف واحد (خريطة SVG، السجل، الجدول، بطاقات الحوادث) |
| `scripts/collect.py` | جامع بيانات يسحب مؤشرات من خرائط التهديد العامة ويكتب `data/live.json` |
| `.github/workflows/collect.yml` | تشغيل الجامع تلقائيًا كل 5 دقائق عبر GitHub Actions |
| `data/live.json` | آخر لقطة بيانات (تُولَّد تلقائيًا) |
| `CNAME` | ربط الدومين `iraq-shield.com` بـ GitHub Pages |

## التشغيل محليًا | Run locally

```bash
git clone https://github.com/Raizo-Ninja/iraq-shield.git
cd iraq-shield
python3 -m http.server 8080
# افتح http://localhost:8080
```

## النشر | Deployment

الموقع ثابت ويُنشر تلقائيًا من الفرع `main` عبر **GitHub Pages** على https://iraq-shield.com.

## تنويه | Disclaimer

الأحداث المعروضة على اللوحة محاكاة لأغراض التدريب والعرض؛ الأهداف والمهاجمون والعناوين افتراضية ولا تمثّل حوادث حقيقية. مؤشرات `data/live.json` مستمدة من خرائط تهديد عامة وتُعرض كما هي.

---

<div align="center">© 2026 Iraq Shield — M. Ismael</div>
