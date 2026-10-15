# DNS zapisi za Cloudflare (zona hikeit.hr)

Cilj: web i e-pošta na MyDataKnox poslužitelju (185.62.75.97). **Sve postaviti na "DNS only" (siva ikona, ne narančasta)** — inače
AutoSSL ne može potvrditi domenu, a poštu Cloudflare ne proxyja.

## Obrisati / promijeniti (stari Render)
- A `@` (hikeit.hr) → 216.24.57.16 i 216.24.57.18 — obrisati
- CNAME `www` → hikeit-frontend.onrender.com — obrisati
- sve druge zapise koji pokazuju na `onrender.com` (npr. `api`) obrisati tek kad se gasi Render

## Dodati
| Tip | Naziv | Vrijednost | Prioritet |
|---|---|---|---|
| A | `@` | 185.62.75.97 | |
| CNAME | `www` | hikeit.hr | |
| A | `dev` | 185.62.75.97 | |
| A | `mail` | 185.62.75.97 | |
| MX | `@` | hikeit.hr | 0 |
| TXT | `@` | `v=spf1 +a +mx +ip4:185.62.75.97 ~all` | |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | |
| TXT | `default._domainkey` | `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlD56DZBw+CvqgRJXtP+SrGRldJYUfCmbXM48Vnr3lRCbwEQzZM4PSyKXGbGHEBzp+abfUHR2mvvPCoQld7B86C06E4R5zKSvrvyy/sHr9y/Q4xVo3y915szjLxDVGbIsHRPTQvYmLdJABKRhW8gG0uqgeskNja/Q8obFfhJ1k16LCubMwBKZrpf6gIJrT+jd1UsS+zhGfWeoB7Up/lQTP89japaFht6F3KVZX9SCbx+KJg0VH6d/sTLDDShwjSKovQPKlebU8yQ4nM7MHMQHZPPhcSawVEH14xS1xHfQvI9iHi+8fWO3xSnkRJzGW4SU1Y0BeouyAFMawp9MbXq4EwIDAQAB;` | |

Nakon propagacije (obično nekoliko minuta): u cPanelu pokrenuti AutoSSL (Security → SSL/TLS Status → Run AutoSSL), provjeriti https za hikeit.hr, www.hikeit.hr i dev.hikeit.hr.
