"""Generate or edit one image with OpenRouter's images API and log what it cost.

Import it (`from gen import gen, spend`) or run it:
  python3 gen.py OUT.png "prompt" [--ref a.png --ref b.png] [--aspect 1:1] [--quality low]
  python3 gen.py --spend

Needs OPENROUTER_IMAGE_API_KEY (the $5/month "claude-image-gen" key). Every call appends a line to
costs.jsonl next to the output file. Keep at most 2-3 calls in flight (see SKILL.md).
"""
import base64, json, os, sys, time, urllib.error, urllib.request

API = "https://openrouter.ai/api/v1"
MODEL = "openai/gpt-image-2"


def _key():
    k = os.environ.get("OPENROUTER_IMAGE_API_KEY")
    if not k:
        sys.exit("OPENROUTER_IMAGE_API_KEY is not set. Only cloud sessions started after it was "
                 "added to the environment (2026-11-22) see it; start a new thread.")
    return k


def _data_url(path):
    mime = "image/jpeg" if path.lower().endswith((".jpg", ".jpeg")) else "image/png"
    return f"data:{mime};base64," + base64.b64encode(open(path, "rb").read()).decode()


def gen(out, prompt, refs=(), model=MODEL, quality="low", aspect_ratio="1:1", retries=4, **extra):
    """Writes the image to `out` (a .png path) and returns its cost in dollars, or None on failure.
    refs: local image paths sent as input_references (subject/pose refs first, then style refs)."""
    body = {"model": model, "prompt": prompt, "aspect_ratio": aspect_ratio, **extra}
    if quality:
        body["quality"] = quality
    if refs:
        body["input_references"] = [{"type": "image_url", "image_url": {"url": _data_url(r)}} for r in refs]
    req = urllib.request.Request(f"{API}/images", data=json.dumps(body).encode(), headers={
        "Authorization": "Bearer " + _key(), "Content-Type": "application/json"})
    t = time.time()
    for attempt in range(retries + 1):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=300))
            break
        except urllib.error.HTTPError as e:
            msg = e.read()[:800].decode(errors="replace")
            if e.code == 429 and attempt < retries:  # provider busy: wait and retry
                time.sleep(30)
                continue
            print(out, "ERROR", e.code, msg, file=sys.stderr)
            return None
    d = r["data"][0]
    img = base64.b64decode(d["b64_json"]) if d.get("b64_json") else urllib.request.urlopen(d["url"]).read()
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    open(out, "wb").write(img)
    cost = (r.get("usage") or {}).get("cost")
    rec = {"file": out, "model": model, "quality": quality, "aspect_ratio": aspect_ratio,
           "refs": list(refs), "cost": cost, "secs": round(time.time() - t, 1), "prompt": prompt}
    with open(os.path.join(os.path.dirname(os.path.abspath(out)), "costs.jsonl"), "a") as f:
        f.write(json.dumps(rec) + "\n")
    print(json.dumps({k: rec[k] for k in ("file", "cost", "secs")}))
    return cost


def spend():
    """Real usage on the key (lags a minute or so). The 403 'Key limit exceeded' error can be a
    false alarm from too many requests in flight; this is the number to trust."""
    req = urllib.request.Request(f"{API}/key", headers={"Authorization": "Bearer " + _key()})
    d = json.load(urllib.request.urlopen(req, timeout=60))["data"]
    return {k: d.get(k) for k in ("usage", "usage_monthly", "limit", "limit_remaining", "limit_reset")}


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("out", nargs="?")
    ap.add_argument("prompt", nargs="?")
    ap.add_argument("--ref", action="append", default=[])
    ap.add_argument("--aspect", default="1:1")
    ap.add_argument("--quality", default="low")
    ap.add_argument("--model", default=MODEL)
    ap.add_argument("--spend", action="store_true")
    a = ap.parse_args()
    if a.spend:
        print(json.dumps(spend(), indent=1))
    elif a.out and a.prompt:
        sys.exit(0 if gen(a.out, a.prompt, a.ref, a.model, a.quality, a.aspect) is not None else 1)
    else:
        ap.print_help()
