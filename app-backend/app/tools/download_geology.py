"""
地質圖資全站下載器 - twgeoref.gsmma.gov.tw
依網站選單層級建立完整資料夾結構，下載所有分類的 PDF 和圖檔

執行：python download_geology.py
需求：pip install requests beautifulsoup4
"""

import re
import time
import requests
from bs4 import BeautifulSoup
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlparse

# ── 設定 ──────────────────────────────────────────────
BASE_URL = "https://twgeoref.gsmma.gov.tw"
LIST_URL = BASE_URL + "/GipOpenWeb/wSite/lp?ctNode={ctNode}&mp=106&idPath={idPath}&pageSize=300"
DETAIL_URL = BASE_URL + "/GipOpenWeb/wSite/ct?xItem={xItem}&ctNode={ctNode}&mp=106"
ROOT_DIR = Path(r"D:\地質資料")
DELAY = 1.0
# ──────────────────────────────────────────────────────

# 網站完整分類結構（依選單層級）
# format: (資料夾路徑tuple, ctNode, idPath)
CATEGORIES = [
    # 年報、年鑑
    (("年報、年鑑",),                               "327",  "326_327"),

    # 地圖、圖集 > 區域地質圖
    (("地圖、圖集", "區域地質圖", "比例尺1_50,000"),  "333",  "326_332_1433_333"),
    (("地圖、圖集", "區域地質圖", "比例尺1_25,000"),  "1396", "326_332_1433_1396"),
    (("地圖、圖集", "區域地質圖", "比例尺1_5,000"),   "1178", "326_332_1433_1178"),
    # 地圖、圖集 > 數值地質圖 / 主題圖
    (("地圖、圖集", "數值地質圖"),                    "1397", "326_332_1397"),
    (("地圖、圖集", "主題圖"),                        "1179", "326_332_1179"),

    # 期刊
    (("期刊", "地質季刊"),                            "331",  "326_338_331"),
    (("期刊", "臺灣省地調所彙刊"),                    "337",  "326_338_337"),
    (("期刊", "地調所彙刊"),                          "330",  "326_338_330"),
    (("期刊", "地調所特刊"),                          "329",  "326_338_329"),
    (("期刊", "地礦中心特刊"),                        "1436", "326_338_1436"),

    # 專書
    (("專書",),                                      "341",  "326_341"),

    # 其他 > 小冊 / 摺頁 / 海報 / 月曆
    (("其他", "小冊_摺頁_海報_月曆"),                 "1435", "326_1434_1435"),
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".tif", ".tiff", ".webp"}

session = requests.Session()
session.headers.update(HEADERS)
session.verify = False

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def sanitize(name: str) -> str:
    name = re.sub(r'[\\/:*?"<>|]', "_", name.strip())
    return re.sub(r'\s+', " ", name)[:120]


def normalize_url(href: str) -> str:
    if href.startswith("http"):
        parsed = urlparse(href)
        if (parsed.scheme == "https" and parsed.port == 443) or \
           (parsed.scheme == "http" and parsed.port == 80):
            href = href.replace(f":{parsed.port}", "", 1)
        return href
    if href.startswith("/"):
        return BASE_URL + href
    return BASE_URL + "/GipOpenWeb/wSite/" + href


def download(url: str, dest: Path) -> bool:
    if dest.exists():
        print(f"      [skip] {dest.name}")
        return True
    try:
        r = session.get(url, timeout=60, stream=True)
        r.raise_for_status()
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        print(f"      [ok]   {dest.name}  ({dest.stat().st_size // 1024} KB)")
        return True
    except Exception as e:
        print(f"      [err]  {url} → {e}")
        return False


def get_book_files(xItem: str, ctNode: str) -> list:
    url = DETAIL_URL.format(xItem=xItem, ctNode=ctNode)
    try:
        r = session.get(url, timeout=30)
        r.raise_for_status()
        r.encoding = r.apparent_encoding or "utf-8"
        soup = BeautifulSoup(r.text, "html.parser")
        files = []
        seen = set()
        for a in soup.find_all("a", href=True):
            href = a.get("href", "").strip()
            if not href:
                continue
            path_only = href.split("?")[0]
            ext = PurePosixPath(unquote(path_only)).suffix.lower()
            if ext not in {".pdf"} | IMAGE_EXTS:
                continue
            full_url = normalize_url(href)
            if full_url in seen:
                continue
            seen.add(full_url)
            label = a.get_text(strip=True) or "檔案"
            files.append({"label": label, "url": full_url, "ext": ext})
        return files
    except Exception as e:
        print(f"      [err] 詳細頁 xItem={xItem}: {e}")
        return []


def get_all_books(ctNode: str, idPath: str) -> list:
    """取得該分類下所有書目（處理多頁）"""
    books = []
    page = 1
    while True:
        url = LIST_URL.format(ctNode=ctNode, idPath=idPath) + f"&nowPage={page}"
        try:
            r = session.get(url, timeout=30)
            r.raise_for_status()
            r.encoding = r.apparent_encoding or "utf-8"
            soup = BeautifulSoup(r.text, "html.parser")

            seen_items = {b["xItem"] for b in books}
            new_books = []
            for a in soup.find_all("a", href=True):
                xItem = re.search(r'xItem=(\d+)', a.get("href", ""))
                if not xItem:
                    continue
                xItem = xItem.group(1)
                text = a.get_text(strip=True)
                if not text or xItem in seen_items:
                    continue
                # 過濾非書目連結
                if any(text == t for t in ['回首頁','地質知識網首頁','地礦中心首頁',
                    '暫存清單','經銷說明','出版品型錄','網站導覽','政府網站資料開放宣告',
                    '服務簡介','專家諮詢',':::','按Enter到主內容區']):
                    continue
                seen_items.add(xItem)
                new_books.append({"title": text, "xItem": xItem})

            if not new_books:
                break
            books.extend(new_books)

            # 確認是否有下一頁
            page_text = soup.get_text()
            total_match = re.search(r'共(\d+)筆', page_text)
            if total_match:
                total = int(total_match.group(1))
                if len(books) >= total:
                    break
            else:
                break
            page += 1
            time.sleep(DELAY)
        except Exception as e:
            print(f"    [err] 列表頁 ctNode={ctNode} page={page}: {e}")
            break
    return books


def process_book(title: str, xItem: str, ctNode: str, folder: Path):
    book_dir = folder / sanitize(title)
    book_dir.mkdir(parents=True, exist_ok=True)

    files = get_book_files(xItem, ctNode)
    if not files:
        print(f"    → 無可下載檔案")
        return

    label_count: dict[str, int] = {}
    for f in files:
        label_count[f["label"]] = label_count.get(f["label"], 0) + 1

    label_used: dict[str, int] = {}
    for f in files:
        label = f["label"]
        ext = f["ext"]
        safe_title = sanitize(title)
        safe_label = sanitize(label)
        if label_count[label] > 1:
            label_used[label] = label_used.get(label, 0) + 1
            filename = f"{safe_title}_{safe_label}_{label_used[label]}{ext}"
        else:
            filename = f"{safe_title}_{safe_label}{ext}"
        download(f["url"], book_dir / filename)
        time.sleep(DELAY)


def main():
    print(f"{'='*60}")
    print(f"  地質圖資全站下載器")
    print(f"  根目錄：{ROOT_DIR}")
    print(f"  共 {len(CATEGORIES)} 個分類")
    print(f"{'='*60}\n")

    total_books = 0
    total_files = 0

    for folder_parts, ctNode, idPath in CATEGORIES:
        category_name = " > ".join(folder_parts)
        folder = ROOT_DIR / Path(*folder_parts)
        folder.mkdir(parents=True, exist_ok=True)

        print(f"\n{'━'*60}")
        print(f"  分類：{category_name}")
        print(f"  目錄：{folder}")

        books = get_all_books(ctNode, idPath)
        # 過濾掉父分類連結和無效項目（通常 title 很短或是導覽文字）
        books = [b for b in books if len(b["title"]) > 3 and
                 not any(k in b["title"] for k in ['首頁','地礦中心','地質知識','暫存','經銷'])]

        print(f"  書目數：{len(books)} 本")
        total_books += len(books)

        for i, book in enumerate(books, 1):
            print(f"\n  [{i}/{len(books)}] {book['title']}")
            process_book(book["title"], book["xItem"], ctNode, folder)
            time.sleep(DELAY)

    print(f"\n{'='*60}")
    print(f"全部完成！")
    print(f"根目錄：{ROOT_DIR}")
    print(f"共處理 {total_books} 本書")


if __name__ == "__main__":
    main()
